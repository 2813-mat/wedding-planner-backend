import { Module } from '@nestjs/common';
import { VendorsController } from './controller/vendors.controller';
import { VendorsService } from './service/vendors.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  imports: [WeddingsModule],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
