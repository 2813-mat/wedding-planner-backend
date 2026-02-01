import { PartialType } from '@nestjs/swagger';
import { CreateHoneymoonDto } from './create-honeymoon.dto';

export class UpdateHoneymoonDto extends PartialType(CreateHoneymoonDto) {}
