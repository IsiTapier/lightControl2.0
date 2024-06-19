import { Body, Controller, Get, HttpException, HttpStatus, Param, Put } from "@nestjs/common";
import { Position } from "./classes/position";
import { MovingHeadService } from "./movingHead.service";

@Controller('movingHeads')
export class PositionController {
    constructor(private readonly movingHeadService: MovingHeadService) {}

    @Get("positions")
    getPositions() {
        return this.movingHeadService.getPositions();
    }

    @Put('position/:id')  // or Head (':id')
    setPosition(@Param("id") mhId : string, @Body("position") position : Position) {
        if(!mhId || !this.movingHeadService.isValidMhId(mhId))
            throw new HttpException('REQUEST-ERROR: mhId is invalid', HttpStatus.BAD_REQUEST);
        return this.movingHeadService.setPosition(mhId, position);
    }

    @Get("home/:id")
    goHome(@Param('id') mhId : string) {
        if(!mhId || !this.movingHeadService.isValidMhId(mhId))
            throw new HttpException('REQUEST-ERROR: mhId is invalid', HttpStatus.BAD_REQUEST);
        return this.movingHeadService.goHome(mhId);
    }

    @Put("home/:id")
    setHome(@Param('id') mhId : string, @Body('position') position : Position) {  // TODO possibility to set home with current position
        if(!mhId || !this.movingHeadService.isValidMhId(mhId))
            throw new HttpException('REQUEST-ERROR: mhId is invalid', HttpStatus.BAD_REQUEST);
        return this.movingHeadService.setHome(mhId, position);
    }
}