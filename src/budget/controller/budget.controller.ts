import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeddingContextInterceptor } from 'src/common/interceptors/wedding-context.interceptor';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';
import { BudgetService } from '../service/budget.service';
import { CreateBudgetCategoryDto } from '../dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from '../dto/update-budget-category.dto';
import { CreateBudgetPaymentDto } from '../dto/create-budget-payment.dto';
import { UpdateBudgetPaymentDto } from '../dto/update-budget-payment.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(WeddingContextInterceptor)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  // --- Categories ---

  @Get('categories')
  async listCategories(@CurrentWedding() weddingId: bigint) {
    return this.budgetService.listCategories(weddingId);
  }

  @Post('categories')
  async createCategory(
    @Body() dto: CreateBudgetCategoryDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.budgetService.createCategory(dto, weddingId);
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateBudgetCategoryDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.budgetService.updateCategory(id, dto, weddingId);
  }

  @Delete('categories/:id')
  @HttpCode(204)
  async deleteCategory(
    @Param('id') id: string,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.budgetService.deleteCategory(id, weddingId);
  }

  // --- Payments ---

  @Get('payments')
  async listPayments(@CurrentWedding() weddingId: bigint) {
    return this.budgetService.listPayments(weddingId);
  }

  @Post('payments')
  async createPayment(
    @Body() dto: CreateBudgetPaymentDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.budgetService.createPayment(dto, weddingId);
  }

  @Put('payments/:id')
  async updatePayment(
    @Param('id') id: string,
    @Body() dto: UpdateBudgetPaymentDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.budgetService.updatePayment(id, dto, weddingId);
  }

  @Delete('payments/:id')
  @HttpCode(204)
  async deletePayment(
    @Param('id') id: string,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.budgetService.deletePayment(id, weddingId);
  }
}
