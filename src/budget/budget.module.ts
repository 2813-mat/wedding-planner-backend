import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget.controller';
import { BudgetService } from './service/budget.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
