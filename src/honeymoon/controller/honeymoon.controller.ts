import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HoneymoonService } from '../service/honeymoon.service';
import { CreateHoneymoonDto } from '../dto/create-honeymoon.dto';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeddingContextInterceptor } from 'src/common/interceptors/wedding-context.interceptor';
import { UpdateHoneymoonDto } from '../dto/update-honeymoon.dto';

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

  @Put(':id')
  async updateHoneymoon(
    @Param('id') id: string,
    @Body() body: UpdateHoneymoonDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.honeymoonService.update(id, body, weddingId);
  }

  @Delete(':id')
  async deleteHoneymoon(
    @Param('id') id: string,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.honeymoonService.delete(id, weddingId);
  }
}
