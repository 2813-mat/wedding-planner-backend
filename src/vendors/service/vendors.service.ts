import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVendorDto } from '../dto/create-vendors.dto';

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
}
