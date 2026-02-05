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
import { CreateGuestDto } from '../dto/create-guests.dto';
import { GuestsService } from '../service/guests.service';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';

@UseGuards(JwtAuthGuard)
@UseInterceptors(WeddingContextInterceptor)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  async create(
    @Body() dto: CreateGuestDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.guestsService.createGuests(dto, weddingId);
  }

  @Get()
  async listAll(@CurrentWedding() weddingId: bigint) {
    return this.guestsService.listGuests(weddingId);
  }
}
