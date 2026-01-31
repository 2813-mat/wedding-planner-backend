import { Module } from '@nestjs/common';
import { GuestsController } from './controller/guests.controller';
import { GuestsService } from './service/guests.service';

@Module({
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}
