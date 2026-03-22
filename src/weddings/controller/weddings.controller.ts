import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { WeddingsService } from '../service/weddings.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWeddingDto } from '../dto/create-wedding.dto';
import { UpdateWeddingDto } from '../dto/update-wedding.dto';

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

  @Get('')
  findWeddings() {
    return this.weddingsService.findWeddings();
  }

  @Post(':id/join')
  @HttpCode(200)
  async join(@Param('id') id: string, @Req() req) {
    return this.weddingsService.joinWedding(id, req.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWeddingDto: UpdateWeddingDto,
    @Req() req,
  ) {
    return this.weddingsService.update(id, updateWeddingDto, req.user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    return this.weddingsService.delete(id, req.user.userId);
  }
}
