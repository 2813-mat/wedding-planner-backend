import { Module } from '@nestjs/common';
import { HoneymoonController } from './controller/honeymoon.controller';
import { HoneymoonService } from './service/honeymoon.service';

@Module({
  controllers: [HoneymoonController],
  providers: [HoneymoonService],
})
export class HonwymoonModule {}
