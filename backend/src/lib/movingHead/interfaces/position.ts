import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Position {
    @Prop({ required: true })
    x : number;
    @Prop({ required: true })
    y : number;
    @Prop({ required: true })
    height : number;
}

export type PositondDocument = Position & Document;
export const PositionSchema = SchemaFactory.createForClass(Position);