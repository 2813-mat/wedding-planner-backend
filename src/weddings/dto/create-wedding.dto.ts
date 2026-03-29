import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsInt,
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

  @ApiProperty({ example: 50000.0, required: false })
  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    { message: 'Orçamento deve ser um número decimal válido com até 2 casas' },
  )
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

  @ApiProperty({ example: 150, required: false })
  @IsInt()
  @IsOptional()
  guestLimit?: number;
}
