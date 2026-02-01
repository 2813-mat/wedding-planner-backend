import { PartialType } from '@nestjs/swagger';
import { CreateGiftContributionDto } from './create-gift-contribution.dto';

export class UpdateGiftContributionDto extends PartialType(
  CreateGiftContributionDto,
) {}
