/*
id: number;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  status: VendorStatus;
  rating: number;
  notes: string;
  price?: string;
*/

import { ApiProperty } from '@nestjs/swagger';
import { VendorCategory, VendorStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'Florista Encantada' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: VendorCategory.decoracao, enum: VendorCategory })
  @IsEnum(VendorCategory)
  category: VendorCategory;

  @ApiProperty({ example: 'Carlos Silva' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ example: 'carlos@floristaencantada.com', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+55 21 99999-9999', required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ example: VendorStatus.cotando, enum: VendorStatus })
  @IsEnum(VendorStatus)
  status: VendorStatus;

  @ApiProperty({
    example: 'Ótimo atendimento e qualidade nas flores',
    required: false,
  })
  @IsString()
  notes?: string;

  @ApiProperty({ example: 50000.0, required: false })
  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    { message: 'Preço deve ser um número decimal válido com até 2 casas' },
  )
  @Type(() => Number)
  @IsOptional()
  price?: number;
}
