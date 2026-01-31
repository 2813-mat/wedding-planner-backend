import { Module } from '@nestjs/common';
import { ChecklistController } from './controller/checklist/checklist.controller';
import { ChecklistService } from './service/checklist/checklist.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService]
})
export class ChecklistModule {}
