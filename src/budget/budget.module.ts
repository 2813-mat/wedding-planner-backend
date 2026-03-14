import { Module } from '@nestjs/common';
import { BudgetController } from './controller/budget.controller';
import { BudgetService } from './service/budget.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  imports: [WeddingsModule],
})
export class BudgetModule {}
