import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Channel } from "../classes/channel";
import { DeviceType } from "../types/deviceType";  
import { Types } from "mongoose";

export type DeviceDocument = DeviceDto & Document;

@Schema()
export class DeviceDto {
  constructor(name: string, type: DeviceType, address: number, channels: Channel[], channelMultiplier: number = 1) {
    this._id = new Types.ObjectId();
    this.name = name;
    this.type = type;
    this.address = address;
    this.channels = channels;
    this.channelMultiplier = channelMultiplier;
  }

  @Prop({ type: Types.ObjectId})
  _id? : Types.ObjectId;

  @Prop()
  name? : string;

  @Prop({ required: true })
  type? : number; // TODO type check

  @Prop({ required: true })
  address? : number;

  // @Prop()// @Prop({ required: true })
  // universe : number;

  @Prop([{ type: Channel, required: true }])
  channels? : Channel[];

  @Prop()
  channelMultiplier? : number;
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceDto);