import { Module } from '@nestjs/common';
import { WeddingsController } from './controller/weddings.controller';
import { WeddingsService } from './service/weddings.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WeddingsController],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
