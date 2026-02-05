import { Module } from '@nestjs/common';
import { GiftsController } from './controller/gifts.controller';
import { GiftsService } from './service/gifts.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
  imports: [WeddingsModule],
})
export class GiftsModule {}
