
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Owner } from './owner.schema';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({required: true, unique: true, index: true})
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Owner' })
  owner: Owner
}

export const CatSchema = SchemaFactory.createForClass(Cat);
