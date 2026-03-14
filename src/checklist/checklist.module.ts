import { Module } from '@nestjs/common';
import { ChecklistController } from './controller/checklist.controller';
import { ChecklistService } from './service/checklist.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService],
  imports: [WeddingsModule],
})
export class ChecklistModule {}
