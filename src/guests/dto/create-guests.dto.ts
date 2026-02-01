import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGuestDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  plusOne?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  confirmed?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  adults?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  children?: number;
}
