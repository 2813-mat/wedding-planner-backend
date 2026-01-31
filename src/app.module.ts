import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/services/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { WeddingsModule } from './weddings/weddings.module';
import { GuestsModule } from './guests/guests.module';
import { VendorsModule } from './vendors/vendors.module';
import { BudgetModule } from './budget/budget.module';
import { ChecklistModule } from './checklist/checklist.module';
import { GiftsModule } from './gifts/gifts.module';
import { HonwymoonModule } from './honeymoon/honwymoon.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    WeddingsModule,
    GuestsModule,
    VendorsModule,
    BudgetModule,
    ChecklistModule,
    GiftsModule,
    HonwymoonModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
