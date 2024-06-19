import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber, Min } from "class-validator";

@Schema()
export class Position {
    constructor(x: number = 0, y: number = 0, height: number = 0) {
        this.x = x; this.y = y; this.height = height;
    }
    
    @IsNumber({}, { message: 'Please Enter X Position in mm'})
    // @Prop({ required: true })
    x : number;

    @IsNumber({}, { message: 'Please Enter Y Position in mm'})
    // @Prop({ required: true })
    y : number;

    @IsNumber({}, { message: 'Please Enter Height in mm'})
    @Min(0, { message: 'Please Enter Height >= 0 in mmm'})
    // @Prop({ required: true })
    height : number;
}

export type PositondDocument = Position & Document;
export const PositionSchema = SchemaFactory.createForClass(Position);