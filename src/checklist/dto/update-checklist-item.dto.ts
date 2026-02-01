import { PartialType } from '@nestjs/swagger';
import { CreateChecklistItemDto } from './create-checklist-item.dto';

export class UpdateChecklistItemDto extends PartialType(
  CreateChecklistItemDto,
) {}
