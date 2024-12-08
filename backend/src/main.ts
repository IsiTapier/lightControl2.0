import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { useContainer } from 'class-validator';
import { DeviceModule } from './lib/device/device.module';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false, cors: true, logger: ['error', 'warn', 'log', 'fatal', 'verbose', 'debug' ]});
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true })); // TODO check options
  app.useLogger(new Logger());
  app.enableCors();
  useContainer(app.select(DeviceModule), { fallbackOnErrors: true });
  await app.listen(3000);
  // TODO load from config
  // await app.listen(process.env.PORT);#
  
}
bootstrap();
