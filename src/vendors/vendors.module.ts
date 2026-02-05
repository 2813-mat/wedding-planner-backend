import { Module } from '@nestjs/common';
import { VendorsController } from './controller/vendors.controller';
import { VendorsService } from './service/vendors.service';
import { WeddingsModule } from 'src/weddings/weddings.module';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService],
  imports: [WeddingsModule],
})
export class VendorsModule {}
