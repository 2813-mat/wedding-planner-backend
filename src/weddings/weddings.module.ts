import { Module } from '@nestjs/common';
import { WeddingsController } from './controller/weddings/weddings.controller';
import { WeddingsService } from './service/weddings/weddings.service';

@Module({
  controllers: [WeddingsController],
  providers: [WeddingsService]
})
export class WeddingsModule {}
