import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WeddingsService } from '../service/weddings.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWeddingDto } from '../dto/create-wedding.dto';

@Controller('weddings')
@UseGuards(JwtAuthGuard)
export class WeddingsController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Post()
  async create(@Body() createWeddingDto: CreateWeddingDto, @Req() req) {
    return this.weddingsService.create(createWeddingDto, req.user.userId);
  }

  @Get('my')
  findMyWeddings(@Req() req) {
    return this.weddingsService.findByUser(req.user.userId);
  }
}
