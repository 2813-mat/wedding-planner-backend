import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHoneymoonDto } from '../dto/create-honeymoon.dto';
import { UpdateHoneymoonDto } from '../dto/update-honeymoon.dto';

@Injectable()
export class HoneymoonService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHoneymoonDto, weddingId: bigint) {
    return this.prisma.honeymoon.create({
      data: {
        destination: dto.destination,
        departureDate: dto.departureDate
          ? new Date(dto.departureDate)
          : undefined,
        returnDate: dto.returnDate ? new Date(dto.returnDate) : undefined,
        budget: dto.budget,
        notes: dto.notes,
        weddingId,
      },
    });
  }

  async listHoneymoons(id: bigint) {
    return this.prisma.honeymoon.findMany({ where: { weddingId: id } });
  }

  async update(id: string, dto: UpdateHoneymoonDto, weddingId: bigint) {
    return this.prisma.honeymoon.update({
      where: { id: BigInt(id) },
      data: dto,
    });
  }

  async delete(id: string, weddingId: bigint) {
    return this.prisma.honeymoon.delete({
      where: { id: BigInt(id) },
    });
  }
}
