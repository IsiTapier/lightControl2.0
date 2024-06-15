
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OwnerDocument = HydratedDocument<Owner>;

@Schema()
export class Owner {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
