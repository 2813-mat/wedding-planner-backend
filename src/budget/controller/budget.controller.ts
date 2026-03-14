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

@UseGuards(JwtAuthGuard)
@UseInterceptors(WeddingContextInterceptor)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

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
}
