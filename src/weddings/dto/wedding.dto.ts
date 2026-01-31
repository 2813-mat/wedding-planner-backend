import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsDecimal, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class WeddingDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  weddingDate: Date;

  @ApiProperty({ required: false })
  @IsString()
  location?: string;

  @ApiProperty()
  @IsDecimal()
  budgetTotal: number;

  // Inclua relações se quiser expor (mas evite ciclos profundos)
  // Ex: coupleName1, coupleName2, etc.

  // Não exponha campos sensíveis como createdBy (a menos que precise)
}
