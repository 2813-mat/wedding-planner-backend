import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGiftDto } from '../dto/create-gift.dto';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGiftDto, weddingId: bigint) {
    return this.prisma.gift.create({
      data: {
        ...dto,
        weddingId,
      },
    });
  }

  async listAll(weddingId: bigint) {
    return this.prisma.gift.findMany({ where: { weddingId: weddingId } });
  }
}
