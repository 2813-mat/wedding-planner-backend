import { ApiProperty } from '@nestjs/swagger';
import { EntityType, FileType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateMediaFileDto {
  @ApiProperty({ enum: EntityType })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty({ enum: FileType })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ required: false })
  description?: string;
}
