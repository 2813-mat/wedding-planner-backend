import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWeddingDto } from 'src/weddings/dto/create-wedding.dto';
import { UpdateWeddingDto } from '../dto/update-wedding.dto';

@Injectable()
export class WeddingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWeddingDto, userId: string) {
    const userBigIntId = BigInt(userId);
    const weddingDate = new Date(dto.weddingDate);

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
            connect: { id: userBigIntId },
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
    const userBigIntId = BigInt(userId);

    return this.prisma.wedding.findMany({
      where: {
        users: {
          some: { userId: userBigIntId },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findWeddings() {
    return this.prisma.wedding.findMany({});
  }

  async findFirstWeddingByUser(userId: string) {
    const weddings = await this.findByUser(userId);
    return weddings[0] ?? null;
  }

  async update(id: string, dto: UpdateWeddingDto, userId: string) {
    const userBigIntId = BigInt(userId);

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: BigInt(id) },
      include: { users: true },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    const hasAccess = wedding.users.some(
      (wu) => wu.userId === userBigIntId && (wu.canEdit || wu.isOwner),
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

  async joinWedding(weddingId: string, userId: string) {
    const weddingBigIntId = BigInt(weddingId);
    const userBigIntId = BigInt(userId);

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingBigIntId },
    });

    if (!wedding) {
      throw new NotFoundException('Casamento não encontrado');
    }

    const existing = await this.prisma.weddingUser.findUnique({
      where: {
        weddingId_userId: { weddingId: weddingBigIntId, userId: userBigIntId },
      },
    });

    if (existing) {
      throw new ConflictException('Usuário já vinculado a este casamento');
    }

    await this.prisma.weddingUser.create({
      data: {
        weddingId: weddingBigIntId,
        userId: userBigIntId,
        isOwner: false,
        canEdit: true,
      },
    });

    return { message: 'Usuário vinculado ao casamento com sucesso' };
  }

  async delete(id: string, userId: string) {
    const userBigIntId = BigInt(userId);

    const wedding = await this.prisma.wedding.findUnique({
      where: { id: BigInt(id) },
      include: { users: true },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    const isOwner = wedding.users.some(
      (wu) => wu.userId === userBigIntId && wu.isOwner,
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
