import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDcument = Device & Document;

@Schema()
export class Device {

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}
export const DeviceSchema = SchemaFactory.createForClass(Device);
