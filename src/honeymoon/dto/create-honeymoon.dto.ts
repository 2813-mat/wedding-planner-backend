import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HoneymoonStatus } from '@prisma/client';

export class CreateHoneymoonDto {
  @ApiProperty({
    required: false,
    example: 'Paris, França',
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({
    required: false,
    example: '2026-09-10',
    description: 'Data de ida (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @ApiProperty({
    required: false,
    example: '2026-09-25',
    description: 'Data de volta (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({
    required: false,
    example: 18500.75,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  budget?: number;

  @ApiProperty({
    required: false,
    example: 'Opção de lua de mel mais romântica',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    required: false,
    enum: HoneymoonStatus,
    example: HoneymoonStatus.planejando,
    description: 'Status inicial da lua de mel',
  })
  @IsOptional()
  @IsEnum(HoneymoonStatus)
  status?: HoneymoonStatus;
}
