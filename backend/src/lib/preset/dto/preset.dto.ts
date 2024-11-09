import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { IsMongoId, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { Position } from "src/lib/movingHead/classes/position";

export type PresetDocument =  PresetDto & Document;

@Schema()
export class PresetDto {
    constructor(name : string, positions : Map<string, Position>) {
        this._id = new Types.ObjectId().toString();
        this.name = name;
        this.positions = positions
    }

    // @IsOptional()
    @IsMongoId({ message: 'Please Enter Valid Mongo-ID' })
    @Prop()
    _id : string;

    // @IsOptional()
    @IsString({ message: 'Please Enter Valid Name' })
    @Prop({required: true})
    name : string;

    // TODO propper check, wrong values possible !!!IMPORTANT
    // TODO crashes when random array is send
    @Transform(({value}) => { let out = new Map<string, Position>(); if(!(Symbol.iterator in Object(value))) return null; for(let [[id, p]] of value) { out.set(id, new Position(p.x, p.y, p.height)) } return out; })
    // @IsValidPositions({ message: 'Please Enter valid positions data'})  
    @ValidateNested()
    @Type(() => Map<string, Position>)
    @Prop({ type: Map<string, Position>, required: true })
    positions : Map<string, Position>;
}

export const PresetSchema = SchemaFactory.createForClass(PresetDto);