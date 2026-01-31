import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsDecimal,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeddingDto {
  @ApiProperty({ example: 'Casamento João e Maria' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2026-10-15' })
  @IsDateString()
  @IsNotEmpty()
  weddingDate: string;

  @ApiProperty({ example: 'Rio de Janeiro, RJ', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '50000.00', required: false })
  @IsDecimal({ force_decimal: true }, { message: 'Orçamento deve ser decimal' })
  @Type(() => Number)
  @IsOptional()
  budgetTotal?: number;

  @ApiProperty({ example: 'João' })
  @IsString()
  @IsOptional()
  coupleName1?: string;

  @ApiProperty({ example: 'Maria' })
  @IsString()
  @IsOptional()
  coupleName2?: string;
}
