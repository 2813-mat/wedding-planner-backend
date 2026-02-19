import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWeddingDto } from 'src/weddings/dto/create-wedding.dto';
import { UpdateWeddingDto } from '../dto/update-wedding.dto';

@Injectable()
export class WeddingsService {
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(dto: CreateWeddingDto, userId: string) {
    const weddingDate = new Date(dto.weddingDate);

    const user = await this.authService.findUserByProviderId(userId);
    if (!user) {
      throw new UnauthorizedException(
        'Não encontrado no banco. Execute /auth/sync-user primeiro.',
      );
    }

    const userBigIntId = BigInt(user.id);

    return this.prisma.$transaction(async (tx) => {
      const wedding = await tx.wedding.create({
        data: {
          title: dto.title,
          weddingDate: weddingDate,
          location: dto.location,
          budgetTotal: dto.budgetTotal
            ? new Prisma.Decimal(dto.budgetTotal)
            : undefined,
          coupleName1: dto.coupleName1,
          coupleName2: dto.coupleName2,
          creator: {
            connect: {
              id: userBigIntId,
            },
          },
        },
      });

      await tx.weddingUser.create({
        data: {
          weddingId: wedding.id,
          userId: userBigIntId,
          isOwner: true,
          canEdit: true,
        },
      });

      return wedding;
    });
  }

  async findByUser(userId: string) {
    const user = await this.authService.findUserByProviderId(userId);

    if (!user) {
      throw new UnauthorizedException(
        'Não encontrado no banco. Execute /auth/sync-user primeiro.',
      );
    }

    const userBigIntId = BigInt(user.id);

    return this.prisma.wedding.findMany({
      where: {
        users: {
          some: { userId: userBigIntId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Retorna o primeiro casamento que o usuário tem acesso (para interceptor/contexto) */
  async findFirstWeddingByUser(userId: string) {
    const weddings = await this.findByUser(userId);
    return weddings[0] ?? null;
  }

  async update(id: string, dto: UpdateWeddingDto, userId: string) {
    const user = await this.authService.findUserByProviderId(userId);
    if (!user) {
      throw new UnauthorizedException(
        'Não encontrado no banco. Execute /auth/sync-user primeiro.',
      );
    }

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: BigInt(id) },
      include: { users: true },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    const hasAccess = wedding.users.some(
      (wu) =>
        wu.userId === BigInt(user.id) && (wu.canEdit || wu.isOwner),
    );
    if (!hasAccess) {
      throw new UnauthorizedException(
        'Você não tem permissão para editar este casamento',
      );
    }

    return this.prisma.wedding.update({
      where: { id: BigInt(id) },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const user = await this.authService.findUserByProviderId(userId);
    if (!user) {
      throw new UnauthorizedException(
        'Não encontrado no banco. Execute /auth/sync-user primeiro.',
      );
    }

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: BigInt(id) },
      include: { users: true },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    const isOwner = wedding.users.some(
      (wu) => wu.userId === BigInt(user.id) && wu.isOwner,
    );
    if (!isOwner) {
      throw new UnauthorizedException(
        'Apenas o dono do casamento pode excluí-lo',
      );
    }

    return this.prisma.wedding.delete({
      where: { id: BigInt(id) },
    });
  }
}
