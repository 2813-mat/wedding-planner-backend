import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  app
    .getHttpAdapter()
    .getInstance()
    .set('json replacer', (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString(); // converte BigInt para string
      }
      return value;
    });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
