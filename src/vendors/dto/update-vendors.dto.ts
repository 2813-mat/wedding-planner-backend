import { PartialType } from '@nestjs/swagger';
import { CreateVendorDto } from './create-vendors.dto';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
