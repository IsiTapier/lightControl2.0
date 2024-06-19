
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch,  Put } from '@nestjs/common';
import { MovingHeadService } from './movingHead.service';
import { MovingHeadDto } from './dto/movingHead.dto';
import { DeviceService } from '../device/device.service';

@Controller('movingHeads')
export class MovingHeadController {
  constructor(private readonly movingHeadService: MovingHeadService, private readonly deviceService : DeviceService) {}

  @Patch()
  add(@Body('mh') mh : MovingHeadDto) {
    if(mh._id && this.movingHeadService.isValidMhId(mh._id)) 
      throw new HttpException('REQUEST-ERROR: mhId already exists', HttpStatus.BAD_REQUEST);
    if(mh.device._id && this.deviceService.isValidDeviceId(mh.device._id))
      throw new HttpException('REQUEST-ERROR: deviceId already exists', HttpStatus.BAD_REQUEST);
    return this.movingHeadService.addMovingHead(mh);
  } 

  @Delete(':id')
  remove(@Param('id') mhId : string) {
    if(!mhId || !this.movingHeadService.isValidMhId(mhId))
      throw new HttpException('REQUEST-ERROR: mhId is invalid', HttpStatus.BAD_REQUEST);
    return this.movingHeadService.removeMovingHead(mhId);
  }

  @Put()
  update(@Body('mh') mh : MovingHeadDto) {
    if(!mh._id || !this.movingHeadService.isValidMhId(mh._id)) 
      throw new HttpException('REQUEST-ERROR: mhId is invalid', HttpStatus.BAD_REQUEST);
    if(this.movingHeadService.getMovingHead(mh._id).isEqualToMh(mh))
      throw new HttpException('REQUEST-ERROR: updated moving head is equal to old one', HttpStatus.BAD_REQUEST);
    mh.device._id = this.movingHeadService.getMovingHead(mh._id).getDeviceId();
    return this.movingHeadService.updateMovingHead(mh);
  }

  @Get()
  getMovingHeads() {
    return this.movingHeadService.getMovingHeads();
  }

  @Put(':id')
  setChannel(@Param('id') mhId : string, @Body("channel") channel : number, @Body("value") value : number) {
    // if(!mhId || !this.movingHeadService.isValidMhId(mhId))
      // throw new HttpException('REQUEST-ERROR: mhID is invalid', HttpStatus.BAD_REQUEST);
    // if(!channel) return 'REQUEST-ERROR: channel is invalid'
    // if(value < 0 || value > 255) return 'REQUEST-ERROR: value not in the range 0-255';
    let result = this.movingHeadService.setChannel(mhId, channel, value);
    if(result.includes('ERROR')) throw new HttpException(result, HttpStatus.BAD_REQUEST);
    return result;
  }
}

