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
  constructor(private deviceService : DeviceService, private movingHeadService : MovingHeadService, private presetService : PresetService, private configService : ConfigService, private catService : CatsService) {
    DMXService.artnet();
    // this.deviceService.addDevice(new DeviceDto("test", DeviceType.Par, 83, [new Channel(ChannelType.Red, 1, 200), new Channel(ChannelType.Green, 2, 20), new Channel(ChannelType.Blue, 3)]));
    /*
    this.movingHeadService.addMovingHead(new MovingHeadDto(-494.6, -467.8, 701.5, 0, 21-2, 540, 240, "MH1", 1,  [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 102), new Channel(ChannelType.Intensity, 101), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()])); // TODO shorter  // TODO negative pan offset
    this.movingHeadService.addMovingHead(new MovingHeadDto(-338.6, -467.8, 685.5, 0, 23.5, 540, 240, "MH2", 14, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 104), new Channel(ChannelType.Intensity, 103), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.movingHeadService.addMovingHead(new MovingHeadDto(-177.9, -467.8, 666.7, 0, 20.5, 540, 240, "MH3", 27, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 106), new Channel(ChannelType.Intensity, 105), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.movingHeadService.addMovingHead(new MovingHeadDto( 172.9, -467.8, 624.1, 0, 21.2, 540, 240, "MH4", 40, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 113), new Channel(ChannelType.Intensity, 112), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.movingHeadService.addMovingHead(new MovingHeadDto( 332.4, -467.8, 604.1, 0, 19.9, 540, 240, "MH5", 53, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 115), new Channel(ChannelType.Intensity, 114), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.movingHeadService.addMovingHead(new MovingHeadDto( 495.7, -467.8, 581.6, 0, 23.5, 540, 240, "MH6", 66, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 117), new Channel(ChannelType.Intensity, 116), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
*/
    
 // const dbUser = this.configService.get<String>('DATABASE_USER');
 /* for(var i = 1; i < 7; i++) {
  // movingHeadService.getMovingHead(i).setXY(-400+800/6*i, 100);
  movingHeadService.getMovingHead(i).setHeight(0);
  }*/
 // let cat =  catService.create({name: "test", age: 1, breed: "muster", owner: {name: "Max", age: 20}});
 }
}
