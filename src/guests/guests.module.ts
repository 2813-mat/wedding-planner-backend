import { Module } from '@nestjs/common';
import { GuestsController } from './controller/guests.controller';
import { GuestsService } from './service/guests.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  controllers: [GuestsController],
  providers: [GuestsService],
  imports: [WeddingsModule],
})
export class GuestsModule {}
