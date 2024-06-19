import { DeviceDto, DeviceSchema } from "src/lib/device/dto/device.dto";
import { Position } from "../classes/position";
import { Channel } from "src/lib/device/classes/channel";
import { DeviceType } from "src/lib/device/types/deviceType";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { IsMongoId, IsNumber, IsObject, IsPositive, Min, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsValidMhDevice } from "../util/mhDeviceValidator";

export type MovingHeadDocument =  MovingHeadDto & Document;

@Schema()
export class MovingHeadDto {        // TODO force pan tilt channel
    constructor(xOff : number, yOff : number, heightOff : number, panOff : number, tiltOff : number, maxPan : number, maxTilt : number, name : string, address : number, /*universe : number,*/    channels : Channel[], home : Position = {x: 0, y : 0, height : 0}) {
        this._id = new Types.ObjectId().toString();
        this.xOff = xOff;
        this.yOff = yOff;
        this.heightOff = heightOff;
        this.panOff = panOff;
        this.tiltOff = tiltOff; // smallest DMX value where mh  => TODO descriptions
        this.maxPan = maxPan;
        this.maxTilt = maxTilt;
        this.home = home;

        // TODO height function !!!

        this.device = new DeviceDto(name, DeviceType.MovingHead, address, channels);
    }

    // @IsOptional()
    @IsMongoId({ message: 'Please Enter Valid Mongo-ID' })
    @Prop()
    _id : string;

    @IsNumber({}, { message: 'Please Enter X Offset in mm'})
    @Prop({ required: true })
    xOff : number;

    @IsNumber({}, { message: 'Please Enter Y Offset in mm'})
    @Prop({ required: true })
    yOff : number;

    @IsNumber({}, { message: 'Please Enter Height Offset in mm'})
    @Min(0, { message: 'Please Enter Height Offset >= 0 in mm'})
    @Prop({ required: true })
    heightOff : number;

    @IsNumber({}, { message: 'Please Enter Pan Offset in DMX-Values'})  // TODO just positive ???
    @Prop({ required: true })
    panOff : number;

    @IsNumber({}, { message: 'Please Enter Tilt Offset in DMX-Values'})
    @Min(0, { message: 'Please Enter Tilt Offset >= 0 in DMX-Values'})
    @Prop({ required: true })
    tiltOff : number;

    @IsPositive({ message: 'Please Enter Maximal Pan in Degree > 0'})
    @Prop({ required: true })
    maxPan : number;

    @IsPositive({ message: 'Please Enter Maximal Tilt in Degree > 0'})
    @Prop({ required: true })
    maxTilt : number;

    @Type(() => Position)
    @ValidateIf((obj, value) => !value || value.x || value.y || value.height)
    @ValidateNested({ message: 'Please Enter Valid Home Position'})
    @Prop({ type: Position })
    home : Position 

    @Transform(({obj, value}) => {value.type = 0; value._id = obj._id; return value;})  // TODO Pfusch richtig machen (mit IDs) !!!
    @IsValidMhDevice({ message: 'Please Enter valid MovingHead Device with at least a Pan and Tilt Channel'})
    @ValidateNested()
    @Type(() => DeviceDto)
    @Prop({ type: DeviceSchema, required : true })
    device : DeviceDto;
}

export const MovingHeadSchema = SchemaFactory.createForClass(MovingHeadDto);