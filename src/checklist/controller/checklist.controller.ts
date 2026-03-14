import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WeddingContextInterceptor } from 'src/common/interceptors/wedding-context.interceptor';
import { CurrentWedding } from 'src/common/decorators/current-wedding.decorator';
import { ChecklistService } from '../service/checklist.service';
import { CreateChecklistItemDto } from '../dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from '../dto/update-checklist-item.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(WeddingContextInterceptor)
@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  async listGrouped(@CurrentWedding() weddingId: bigint) {
    return this.checklistService.listGrouped(weddingId);
  }

  @Post('tasks')
  async createTask(
    @Body() dto: CreateChecklistItemDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.checklistService.createTask(dto, weddingId);
  }

  @Put('tasks/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateChecklistItemDto,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.checklistService.updateTask(id, dto, weddingId);
  }

  @Delete('tasks/:id')
  @HttpCode(204)
  async deleteTask(
    @Param('id') id: string,
    @CurrentWedding() weddingId: bigint,
  ) {
    return this.checklistService.deleteTask(id, weddingId);
  }
}
