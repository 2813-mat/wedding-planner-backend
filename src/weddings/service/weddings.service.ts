import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWeddingDto } from 'src/weddings/dto/create-wedding.dto';

@Injectable()
export class WeddingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWeddingDto, userId: bigint) {
    return this.prisma.wedding.create({
      data: { ...dto, creator: { connect: { id: userId } } },
    });
  }

  async findByUser(userId: bigint) {
    return this.prisma.wedding.findMany({
      where: { createdBy: userId },
    });
  }
}
