import { Module } from '@nestjs/common';
import { GiftsController } from './controller/gifts/gifts.controller';
import { GiftsService } from './service/gifts/gifts.service';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService]
})
export class GiftsModule {}
