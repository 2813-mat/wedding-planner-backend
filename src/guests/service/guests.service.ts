import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuestDto } from '../dto/create-guests.dto';
import { UpdateGuestDto } from '../dto/update-guests.dto';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  async createGuests(dto: CreateGuestDto, weddingId: bigint) {
    return this.prisma.guest.create({
      data: {
        ...dto,
        weddingId,
      },
    });
  }

  async listGuests(weddingId: bigint) {
    return this.prisma.guest.findMany({ where: { weddingId: weddingId } });
  }

  async update(id: string, dto: UpdateGuestDto, weddingId: bigint) {
    return this.prisma.guest.update({
      where: { id: BigInt(id) },
      data: dto,
    });
  }

  async delete(id: string, weddingId: bigint) {
    return this.prisma.guest.delete({
      where: { id: BigInt(id) },
    });
  }
}
