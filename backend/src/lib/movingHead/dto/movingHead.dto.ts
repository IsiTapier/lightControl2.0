import { DeviceDto, DeviceSchema } from "src/lib/device/dto/device.dto";
import { Position } from "../interfaces/position";
import { Channel } from "src/lib/device/classes/channel";
import { DeviceType } from "src/lib/device/types/deviceType";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type MovingHeadDocument =  MovingHeadDto & Document;

@Schema()
export class MovingHeadDto {
    constructor(xOff : number, yOff : number, heightOff : number, panOff : number, tiltOff : number, maxPan : number, maxTilt : number, name : string, address : number, /*universe : number,*/    channels : Channel[]) {
        this._id = new Types.ObjectId;
        this.xOff = xOff;
        this.yOff = yOff;
        this.heightOff = heightOff;
        this.panOff = panOff;
        this.tiltOff = tiltOff; // smallest DMX value where mh 
        this.maxPan = maxPan;
        this.maxTilt = maxTilt;

        // TODO home

        this.device = new DeviceDto(name, DeviceType.MovingHead, address, channels);
    }
    @Prop({ type: Types.ObjectId })
    _id : Types.ObjectId = new Types.ObjectId();
    @Prop({ required: true })
    xOff : number;
    @Prop({ required: true })
    yOff : number;
    @Prop({ required: true })
    heightOff : number;
    @Prop({ required: true })
    panOff : number;
    @Prop({ required: true })
    tiltOff : number;
    @Prop({ required: true })
    maxPan : number;
    @Prop({ required: true })
    maxTilt : number;
    @Prop({ type: Position })
    home : Position = {x: 0, y : 0, height : 0};
    @Prop({ type: DeviceSchema, required : true })
    device : DeviceDto;
}

export const MovingHeadSchema = SchemaFactory.createForClass(MovingHeadDto);