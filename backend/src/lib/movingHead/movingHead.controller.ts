
import { Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { MovingHeadService } from './movingHead.service';

@Controller('movingHeads')
export class MovingHeadController {
  constructor(private movingHeadService: MovingHeadService) {}

  @Patch()
  add() { // TODO Querrys
    // return this.movingHeadService.addMovingHead(); // TODO convert to mh
  }

  @Delete()
  remove(@Query("mhId") mhId) {
    if(!mhId) return 'REQUEST-ERROR: mhId is invalid';
    return this.movingHeadService.removeMovingHead(mhId);
  }

  @Put()
  update(@Query("mhId") mhId) { // TODO Querries
    if(!mhId) return 'REQUEST-ERROR: mhId is invalid';
    // return this.movingHeadService.updateMovingHead(mhId, ); // TODO convert to mh
  }

  @Get()
  getMovingHeads() {
    let mh = this.movingHeadService.getMovingHeads();
    // TODO return (JSON) or DTO
  }

  @Get("positions")
  getPositions() {
    // TODO get positions of every moving head and send it
  }

  @Put("channel")
  setChannel(@Query("mhId") mhId, @Query("channel") channel, @Query("value") value) {
    if(!mhId) return 'REQUEST-ERROR: mhId is invalid';
    if(!channel) return 'REQUEST-ERROR: channel is invalid'
    if(value < 0 || value > 255) return 'REQUEST-ERROR: value not in the range 0-255';
    return this.movingHeadService.setChannel(mhId, channel, value);
  }

  @Put("position")
  setPosition(@Query("mhId") mhId, @Query("x") x, @Query("y") y) {
    if(!mhId) return 'REQUEST-ERROR: mhId is invalid';
    if(this.movingHeadService.getMovingHead(mhId) === null) return "ERROR: mhId doesn't exist"
    this.movingHeadService.getMovingHead(mhId).setXY(x, y);
  }

  @Put("height")
  setHeight(@Query("mhId") mhId, @Query("height") height) {
    if(!mhId) return 'REQUEST-ERROR: mhId is invalid';
    if(height < 0) return 'REQUEST-ERROR: height is invalid';
    if(this.movingHeadService.getMovingHead(mhId) === null) return "ERROR: mhId doesn't exist"
    this.movingHeadService.getMovingHead(mhId).setHeight(height);
  }

}