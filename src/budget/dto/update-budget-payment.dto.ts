import { PartialType } from '@nestjs/swagger';
import { CreateBudgetPaymentDto } from './create-budget-payment.dto';

export class UpdateBudgetPaymentDto extends PartialType(
  CreateBudgetPaymentDto,
) {}
