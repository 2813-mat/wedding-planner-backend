import { Module } from '@nestjs/common';
import { HoneymoonController } from './controller/honeymoon.controller';
import { HoneymoonService } from './service/honeymoon.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  controllers: [HoneymoonController],
  providers: [HoneymoonService],
  imports: [WeddingsModule],
})
export class HonwymoonModule {}
