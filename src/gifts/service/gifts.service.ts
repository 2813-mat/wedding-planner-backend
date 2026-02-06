import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGiftDto } from '../dto/create-gift.dto';
import { UpdateGiftDto } from '../dto/update-gift.dto';

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

  async update(id: string, dto: UpdateGiftDto, weddingId: bigint) {
    return this.prisma.gift.update({
      where: { id: BigInt(id) },
      data: dto,
    });
  }

  async delete(id: string, weddingId: bigint) {
    return this.prisma.gift.delete({
      where: { id: BigInt(id) },
    });
  }
}
