import { PartialType } from '@nestjs/swagger';
import { CreateGuestDto } from './create-guests.dto';

export class UpdateGuestDto extends PartialType(CreateGuestDto) {}
