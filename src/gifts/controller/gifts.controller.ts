import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeddingContextInterceptor } from 'src/common/interceptors/wedding-context.interceptor';
import { GiftsService } from '../service/gifts.service';
import { CreateGiftDto } from '../dto/create-gift.dto';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';

@UseGuards(JwtAuthGuard)
@UseInterceptors(WeddingContextInterceptor)
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Post()
  async create(
    @Body() dto: CreateGiftDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.giftsService.create(dto, weddingId);
  }

  @Get()
  async listAll(@CurrentWedding() weddingId: bigint) {
    return this.giftsService.listAll(weddingId);
  }
}
