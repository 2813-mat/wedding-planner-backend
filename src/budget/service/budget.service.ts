import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetCategoryDto } from '../dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from '../dto/update-budget-category.dto';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  private mapCategory(category: any) {
    return {
      id: category.id,
      weddingId: category.weddingId,
      name: category.name,
      planned: Number(category.allocated),
      spent: Number(category.spent),
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async listCategories(weddingId: bigint) {
    const categories = await this.prisma.budgetCategory.findMany({
      where: { weddingId },
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map(this.mapCategory);
  }

  async createCategory(dto: CreateBudgetCategoryDto, weddingId: bigint) {
    const category = await this.prisma.budgetCategory.create({
      data: {
        weddingId,
        name: dto.name,
        allocated: dto.planned,
        spent: dto.spent ?? 0,
        color: dto.color,
      },
    });
    return this.mapCategory(category);
  }

  async updateCategory(
    id: string,
    dto: UpdateBudgetCategoryDto,
    weddingId: bigint,
  ) {
    const existing = await this.prisma.budgetCategory.findFirst({
      where: { id: BigInt(id), weddingId },
    });
    if (!existing) throw new NotFoundException('Budget category not found');

    const category = await this.prisma.budgetCategory.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.planned !== undefined && { allocated: dto.planned }),
        ...(dto.spent !== undefined && { spent: dto.spent }),
        ...(dto.color !== undefined && { color: dto.color }),
      },
    });
    return this.mapCategory(category);
  }

  async deleteCategory(id: string, weddingId: bigint) {
    const existing = await this.prisma.budgetCategory.findFirst({
      where: { id: BigInt(id), weddingId },
    });
    if (!existing) throw new NotFoundException('Budget category not found');

    await this.prisma.budgetCategory.delete({ where: { id: BigInt(id) } });
  }
}
