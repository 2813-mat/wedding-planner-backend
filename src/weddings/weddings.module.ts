import { Module } from '@nestjs/common';
import { WeddingsController } from './controller/weddings.controller';
import { WeddingsService } from './service/weddings.service';

@Module({
  controllers: [WeddingsController],
  providers: [WeddingsService],
})
export class WeddingsModule {}
