import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWeddingDto } from 'src/weddings/dto/create-wedding.dto';

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

    return this.prisma.wedding.create({
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
  }

  async findByUser(userId: string) {
    const user = await this.authService.findUserByProviderId(userId);
    if (!user) {
      throw new UnauthorizedException(
        'Não encontrado no banco. Execute /auth/sync-user primeiro.',
      );
    }

    const userBigIntId = BigInt(user.id);

    return this.prisma.wedding.findFirst({
      where: { createdBy: userBigIntId },
    });
  }
}
