import { Module } from '@nestjs/common';
import { VendorsController } from './controller/vendors/vendors.controller';
import { VendorsService } from './service/vendors/vendors.service';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService]
})
export class VendorsModule {}
