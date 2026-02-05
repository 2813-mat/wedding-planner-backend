import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VendorsService } from '../service/vendors.service';
import { CreateVendorDto } from '../dto/create-vendors.dto';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';
import { WeddingContextInterceptor } from 'src/common/interceptors/wedding-context.interceptor';

@Controller('vendors')
@UseInterceptors(WeddingContextInterceptor)
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  async createVendors(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    console.log('wedding id', weddingId);
    return this.vendorsService.create(createVendorDto, weddingId);
  }

  @Get()
  async listAll(@CurrentWedding() weddingId: bigint) {
    return this.vendorsService.listVendors(weddingId);
  }
}
