
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DMXService } from 'src/lib/dmx/dmx.service';
import { DeviceService } from './device.service';
import { DeviceDto } from './dto/device.dto';
import { ValidIdType } from './util/idValidator';
import { DeviceType } from './types/deviceType';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService : DeviceService) {}

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
  @UsePipes(new ValidationPipe({ groups: [ValidIdType.AVAILABLE]}))
  add(@Body('device') device : DeviceDto) {
    if(device.type === DeviceType.MovingHead) 
      throw new HttpException('to register a moving head please use /movingHeads', HttpStatus.BAD_REQUEST);
    // device.channels = device.channels.map((ch) => new Channel(ch.type, ch.inputAddress, ch.defaultValue));
    // device = new DeviceDto(device.name, device.type, device.address, device.channels, device.channelMultiplier);
    return this.deviceService.addDevice(device);
  }

  @Delete(':id')
  remove(@Param('id') deviceId : string) {
    if(!deviceId || !this.deviceService.isValidDeviceId(deviceId))
      throw new HttpException('REQUEST-ERROR: deviceId is invalid', HttpStatus.BAD_REQUEST);
    return this.deviceService.removeDevice(deviceId);
  }

  @Put()
  @UsePipes(new ValidationPipe({ groups: [ValidIdType.EXISTS, ValidIdType.UNEQUAL]}))
  update(@Body('device') device: DeviceDto) {
    if(device.type === DeviceType.MovingHead) 
      throw new HttpException('to update a moving head please use /movingHeads', HttpStatus.BAD_REQUEST);
    // if(!device._id || !this.deviceService.isValidDeviceId(device._id)) return 'REQUEST-ERROR: deviceId is invalid'; // TODO as validation constraint
    // device.channels = device.channels.map((ch) => new Channel(ch.type, ch.inputAddress, ch.defaultValue)); // TODO rework
    return this.deviceService.updateDevice(device);
  }

  @Get()
  getDevices() {
    return this.deviceService.getDevices();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ groups: [ValidIdType.EXISTS]}))
  setChannel(@Param('id') deviceId, @Body("channel") channel, @Body("value") value) {
    // if(!this.deviceService.isValidDeviceId(deviceId)) return 'REQUEST-ERROR: deviceId is invalid';
    // if(channel < 0) return 'REQUEST-ERROR: channel is invalid'
    // if(value < 0 || value > 255) return 'REQUEST-ERROR: value not in the range 0-255';
    let result = this.deviceService.setChannel(deviceId, channel, value);
    if(result.includes('ERROR')) throw new HttpException(result, HttpStatus.BAD_REQUEST);
    return result;
  }
}
