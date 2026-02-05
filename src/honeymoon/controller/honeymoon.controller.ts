import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HoneymoonService } from '../service/honeymoon.service';
import { CreateHoneymoonDto } from '../dto/create-honeymoon.dto';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeddingContextInterceptor } from 'src/common/interceptors/wedding-context.interceptor';

@Controller('honeymoon')
@UseInterceptors(WeddingContextInterceptor)
@UseGuards(JwtAuthGuard)
export class HoneymoonController {
  constructor(private honeymoonService: HoneymoonService) {}

  @Post()
  async createHoneymoon(
    @Body() body: CreateHoneymoonDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    console.log('wedding id', weddingId);
    return this.honeymoonService.create(body, weddingId);
  }

  @Get()
  async listHoneymoons(@CurrentWedding() weddingId: bigint) {
    return this.honeymoonService.listHoneymoons(weddingId);
  }
}
