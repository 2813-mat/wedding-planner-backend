import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VendorsService } from '../service/vendors.service';
import { CreateVendorDto } from '../dto/create-vendors.dto';
import { WeddingsService } from 'src/weddings/service/weddings.service';

@Controller('vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly weddingService: WeddingsService,
  ) {}

  @Post()
  async createVendors(@Body() createVendorDto: CreateVendorDto, @Req() req) {
    const wedding = await this.weddingService.findByUser(req.user.userId);

    if (!wedding) {
      throw new Error('Wedding not found for this user');
    }

    return this.vendorsService.create(createVendorDto, wedding?.id);
  }

  // @Get()
  // async listAll(@Req() req) {
  //   const wedding = await this.weddingService.findByUser(req.user.userId);

  //   if (!wedding) {
  //     throw new Error('Wedding not found for this user');
  //   }

  //   return this.vendorsService.create(wedding?.id);
  // }
}
