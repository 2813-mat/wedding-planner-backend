import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVendorDto } from '../dto/create-vendors.dto';
import { UpdateVendorDto } from '../dto/update-vendors.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVendorDto, weddingId: bigint) {
    return this.prisma.vendor.create({
      data: {
        ...dto,
        weddingId,
      },
    });
  }

  async listVendors(weddingId: bigint) {
    return this.prisma.vendor.findMany({
      where: { weddingId: weddingId },
    });
  }

  async update(id: string, dto: UpdateVendorDto, weddingId: bigint) {
    return this.prisma.vendor.update({
      where: { id: BigInt(id) },
      data: dto,
    });
  }

  async delete(id: string, weddingId: bigint) {
    return this.prisma.vendor.delete({
      where: { id: BigInt(id) },
    });
  }
}
