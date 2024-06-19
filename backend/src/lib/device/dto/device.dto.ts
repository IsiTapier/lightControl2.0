import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Channel } from "../classes/channel";
import { DeviceType } from "../types/deviceType";  
import { mongo } from "mongoose";
import { ArrayNotEmpty, IsArray, IsEnum, IsMongoId, IsOptional, IsPositive, IsString, ValidateIf } from "class-validator";
import { IsAvailableDMXAddress } from "../util/addressValidator";
import { Transform } from "class-transformer";
import { IsValidId, ValidIdType } from "../util/idValidator";

export type DeviceDocument = DeviceDto & Document;

@Schema()
export class DeviceDto {
  constructor(name: string, type: DeviceType, address: number, channels: Channel[], channelMultiplier: number = 1) {
    this._id = new mongo.ObjectId().toString();
    this.name = name;
    this.type = type;
    this.address = address;
    this.channels = channels;
    this.channelMultiplier = channelMultiplier;
  }
  
  @IsMongoId({ message: 'Please Enter Valid Mongo-ID', always: true })
  @ValidateIf(dto => false)
  @IsValidId(ValidIdType.EXISTS, {groups: [ValidIdType.EXISTS], message: 'ERROR: deviceId not found'})
  @IsValidId(ValidIdType.UNEQUAL, {groups: [ValidIdType.UNEQUAL], message: 'ERROR: updated device is equal to old one'})
  @IsValidId(ValidIdType.AVAILABLE, {groups: [ValidIdType.AVAILABLE], message: 'ERROR: device id already exists'})
  @Prop()
  _id? : string;

  @IsOptional()
  @IsString({ message: 'Please Enter Valid Name' })
  @Prop()
  name? : string;

  @IsEnum(DeviceType, { message: 'Please Enter Valid Device Type' })
  @Prop({ required: true })
  type? : number; // TODO type check

  @IsAvailableDMXAddress('channels', 'channelMultiplier', '_id', { message: 'Please Enter Available Address between 1 and 512 - [channels used]' })
  @Prop({ required: true })
  address? : number;

  // @Prop()// @Prop({ required: true })
  // universe : number;

  @IsArray({ message: 'Please Enter Valid Channel Array'})
  @ArrayNotEmpty({ message: 'Please Enter at least one Channel' })
  @Transform(({value}) => {if(!Array.isArray(value)) return []; return value.map((ch) => new Channel(ch.type, ch.inputAddress, ch.defaultValue));})
  @Prop([{ type: Channel, required: true }])
  channels? : Channel[];

  @IsOptional()
  @IsPositive({ message: 'Please Enter Channelmultiplier greater then 0' })
  @Prop()
  channelMultiplier? : number;
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceDto);