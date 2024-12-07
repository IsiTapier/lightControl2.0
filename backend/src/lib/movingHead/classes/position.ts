import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber, Max, Min } from "class-validator";

@Schema()
export class Position {
    constructor(x: number = 0, y: number = 0, height: number = 0, zoom: number = 0) {
        this.x = x; this.y = y; this.height = height; this.zoom = zoom;
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

    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Please Enter Zoom value'})
    @Min(0, { message: 'Please Enter Zoom value >= 0'})
    @Max(255, { message: 'Please Enter Zoom value <= 255'})
    zoom : number;
}

export type PositondDocument = Position & Document;
export const PositionSchema = SchemaFactory.createForClass(Position);