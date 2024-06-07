
import { Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { sender } from 'dmxnet';
import { DMXService } from 'src/lib/dmx/dmx.service';
import { DeviceModule } from './device.module';
import { DeviceService } from './device.service';

@Controller('devices')
export class DeviceController {
  constructor(private deviceService : DeviceService) {}

  @Get("test")
  test(): string {
      DMXService.getSender().setChannel(1, 0);
      return 'This action returns test';
  }

  @Get("color")
  color(@Query() params : any) : void {
    console.log("test");
    if(params.color === "red") this.red(params.int);
    else if(params.color === "green") this.green(params.int);
    else if (params.color === "blue") this.blue(params.int);
    else {
    // DMXService.getSender().fillChannels(1, 3, 0);
    DMXService.getSender().prepChannel(1, 0);
    DMXService.getSender().prepChannel(2, 0);
    DMXService.getSender().prepChannel(3, 0);
    DMXService.getSender().transmit();
      }
  }

  @Get("red")
  red(@Query("int") int = 255): void {
    console.log("red");
    DMXService.getSender().prepChannel(1, Math.min(int||255, 255));
    DMXService.getSender().prepChannel(2, 0);
    DMXService.getSender().prepChannel(3, 0);
    DMXService.getSender().transmit();
  }
  
  @Post("green")
  green(@Query("int") int = 255) : void {
    console.log("green");
    DMXService.getSender().prepChannel(1, 0);
    DMXService.getSender().prepChannel(2, Math.min(int, 255));
    DMXService.getSender().prepChannel(3, 0);
    DMXService.getSender().transmit();
  }

  @Post("blue")
  blue(@Query("int") int = 255): void {
    console.log("blue");
    DMXService.getSender().prepChannel(1, 0);
    DMXService.getSender().prepChannel(2, 0);
    DMXService.getSender().prepChannel(3, Math.min(int||255, 255));
    DMXService.getSender().transmit();   
  }

  @Patch()
  add() { // TODO Querrys
    // return this.deviceService.addDevice(); // TODO convert to Device
  }

  @Delete()
  remove(@Query("deviceId") deviceId) {
    if(!deviceId) return 'REQUEST-ERROR: deviceId is invalid';
    return this.deviceService.removeDevice(deviceId);
  }

  @Put()
  update(@Query("deviceId") deviceId) { // TODO Querries
    if(!deviceId) return 'REQUEST-ERROR: deviceId is invalid';
    // return this.deviceService.updateDevice(deviceId, ); // TODO convert to Device
  }

  @Get()
  getDevices() {
    let mh = this.deviceService.getDevices();
    // TODO return (JSON) or DTO
  }

  @Put("channel")
  setChannel(@Query("deviceId") deviceId, @Query("channel") channel, @Query("value") value) {
    if(!deviceId) return 'REQUEST-ERROR: deviceId is invalid';
    if(!channel) return 'REQUEST-ERROR: channel is invalid'
    if(value < 0 || value > 255) return 'REQUEST-ERROR: value not in the range 0-255';
    return this.deviceService.setChannel(deviceId, channel, value);
  }
}
