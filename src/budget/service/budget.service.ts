import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetCategoryDto } from '../dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from '../dto/update-budget-category.dto';
import { CreateBudgetPaymentDto } from '../dto/create-budget-payment.dto';
import { UpdateBudgetPaymentDto } from '../dto/update-budget-payment.dto';

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

  private mapPayment(payment: any) {
    return {
      id: payment.id,
      weddingId: payment.weddingId,
      categoryId: payment.categoryId,
      categoryName: payment.category?.name ?? null,
      amount: Number(payment.amount),
      date: payment.date,
      description: payment.description,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private async recalculateSpent(categoryId: bigint) {
    const result = await this.prisma.budgetPayment.aggregate({
      where: { categoryId },
      _sum: { amount: true },
    });
    const total = result._sum.amount ?? 0;
    await this.prisma.budgetCategory.update({
      where: { id: categoryId },
      data: { spent: total },
    });
  }

  // --- Categories ---

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
        spent: 0,
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

  // --- Payments ---

  async listPayments(weddingId: bigint) {
    const payments = await this.prisma.budgetPayment.findMany({
      where: { weddingId },
      include: { category: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
    return payments.map(this.mapPayment);
  }

  async createPayment(dto: CreateBudgetPaymentDto, weddingId: bigint) {
    const category = await this.prisma.budgetCategory.findFirst({
      where: { id: BigInt(dto.categoryId), weddingId },
    });
    if (!category) throw new NotFoundException('Budget category not found');

    const payment = await this.prisma.budgetPayment.create({
      data: {
        weddingId,
        categoryId: BigInt(dto.categoryId),
        amount: dto.amount,
        date: new Date(dto.date),
        description: dto.description,
      },
      include: { category: { select: { name: true } } },
    });

    await this.recalculateSpent(BigInt(dto.categoryId));

    return this.mapPayment(payment);
  }

  async updatePayment(
    id: string,
    dto: UpdateBudgetPaymentDto,
    weddingId: bigint,
  ) {
    const existing = await this.prisma.budgetPayment.findFirst({
      where: { id: BigInt(id), weddingId },
    });
    if (!existing) throw new NotFoundException('Budget payment not found');

    const oldCategoryId = existing.categoryId;
    const newCategoryId = dto.categoryId
      ? BigInt(dto.categoryId)
      : oldCategoryId;

    if (dto.categoryId) {
      const category = await this.prisma.budgetCategory.findFirst({
        where: { id: newCategoryId, weddingId },
      });
      if (!category) throw new NotFoundException('Budget category not found');
    }

    const payment = await this.prisma.budgetPayment.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.categoryId !== undefined && {
          categoryId: BigInt(dto.categoryId),
        }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      include: { category: { select: { name: true } } },
    });

    await this.recalculateSpent(newCategoryId);
    if (dto.categoryId && newCategoryId !== oldCategoryId) {
      await this.recalculateSpent(oldCategoryId);
    }

    return this.mapPayment(payment);
  }

  async deletePayment(id: string, weddingId: bigint) {
    const existing = await this.prisma.budgetPayment.findFirst({
      where: { id: BigInt(id), weddingId },
    });
    if (!existing) throw new NotFoundException('Budget payment not found');

    await this.prisma.budgetPayment.delete({ where: { id: BigInt(id) } });
    await this.recalculateSpent(existing.categoryId);
  }
}
