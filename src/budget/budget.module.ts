import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget/budget.controller';
import { BudgetService } from './service/budget/budget.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService]
})
export class BudgetModule {}
