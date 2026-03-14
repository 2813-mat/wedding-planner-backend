import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsHexColor, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBudgetCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  planned: number;

  @ApiProperty()
  @IsHexColor()
  color: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  spent?: number;
}
