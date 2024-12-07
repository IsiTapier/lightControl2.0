import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceService } from './lib/device/device.service';
import { MovingHeadService } from './lib/movingHead/movingHead.service';
import { PresetService } from './lib/preset/presets.service';
import { DeviceModule } from './lib/device/device.module';
import { MovingHeadModule } from './lib/movingHead/movingHead.module';
import { PresetModule } from './lib/preset/presets.module';
import { DMXService } from './lib/dmx/dmx.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './lib/cat/cats.module';
import { CatsService } from './lib/cat/cats.service';

interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
} 

@Module({
  imports: [
    DeviceModule,  
    MovingHeadModule,
    PresetModule,
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DMXService],

})
export class AppModule {
  constructor() {
    DMXService.artnet();
  }
}
