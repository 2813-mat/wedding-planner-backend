import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChecklistItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  period: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
