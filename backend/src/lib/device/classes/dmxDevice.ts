import { DMXService } from "src/lib/dmx/dmx.service";
import { DeviceType } from "../types/deviceType";
import { Channel } from "./channel";
import { ChannelType } from "../types/channelType";
import { DeviceDto } from "../dto/device.dto";

export class DMXDevice {
    private deviceId : string;
    private name : string;
    private type : DeviceType;
    private address : number;
    // private universe : number;
    private channels : Channel[] = [];
    private channelMultiplier : number;
    private virtualMaster : boolean;        // TODO proper Virtual Master with Address
    private VMValue : number;
    private values: number[];

    public constructor(dto : DeviceDto) {
        this.deviceId = dto._id;
        this.name = dto.name;
        this.type = dto.type;
        this.address = dto.address;
        this.channels = dto.channels.map((ch) => new Channel(ch.type, ch.inputAddress, ch.defaultValue));
        this.channelMultiplier = dto.channelMultiplier;
        this.virtualMaster = false; // TODO proper virtual Master
        this.VMValue = 0;
        this.values = [dto.channels.length*dto.channelMultiplier]; // TODO store??

        // this.init(true); ???
        // (TODO send initial DMX Values) done?
    }

    public isEqualTo(device : DeviceDto) : boolean {
        return  this.deviceId === device._id && 
                this.name === device.name && 
                this.type === device.type && 
                this.address === device.address && 
                JSON.stringify(this.channels)===JSON.stringify(device.channels) &&
                this.channelMultiplier === device.channelMultiplier;
    }

    public init(update : boolean) : void {
        for(let i = 0; i < this.channels.length; i++) {
            if(this.channels[i].type === ChannelType.Intensity) this.virtualMaster = false;
            for(let j = 0; j < this.channelMultiplier; j++) this.writeChannel(this.channels.length*j+i, this.channels[i].defaultValue);
        }
        if(update) DMXService.update();
    }

    public setDeviceId(id : string) : void {
        this.deviceId = id;
    }

    public getDeviceId() : string {
        return this.deviceId;
    }

    public getType() : DeviceType {
        return this.type;
    }

    public getStartAddress() : number {
        return this.address;
    }

    public getEndAddress() : number {
        return this.address+this.channels.length*this.channelMultiplier -1;
    }

  /*  public setName(name : string) {
        this.name = name;
    }*/

    public writeChannel(channel : number, value : number, update : boolean = false) : string {
        if(channel < 0 || channel >= this.channels.length * this.channelMultiplier) return "ERROR: channel is not in range of the device channels";
        if(value < 0 || value > 255) return "ERROR: value not in the range 0-255";

        this.values[channel] = value; // TODO Virtual Master ???

        DMXService.setChannel(this.address+channel, value, update);
        return "STATUS: successful set channel "+channel+" to "+value;
    }

    public writeType(type : ChannelType, value : number, update : boolean = false)  : string {
        if(value < 0 || value > 255) return "ERROR: value not in the range 0-255";

        if(type === ChannelType.None) return "ERROR: no valid channel type";
        if(this.virtualMaster === true) {
            if(type === ChannelType.Intensity && this.virtualMaster === true) this.VMValue = value;
            else if(type == ChannelType.Red || type == ChannelType.Green || type == ChannelType.Blue || type == ChannelType.White || type == ChannelType.WarmWhite) value = value*this.VMValue/256;
        }
        
        for(let i = 0; i < this.channels.length; i++) {
            if(this.channels[i].type !== type) continue;
            for(let j = 0; j < this.channelMultiplier; j++)
                this.writeChannel(j*this.channels.length+i, value, update);
        } 
        return "STATUS: successful set all channels of type "+type+" to "+value;
    }

    public blackout(update : boolean = true) : void {
        for(let i = 0; i < this.channels.length*this.channelMultiplier; i++) {
            this.writeChannel(i, 0);
        }
        if(update) DMXService.update();
    }

   /* public writeMaster(value : number) {
        this.writeType('M', value);
    }*/

    public update(update: boolean = false) : boolean { // TODO update needed?
        let hasChanged = false;
        for(let i = 0; i < this.channels.length; i++) {
            if(this.channels[i].inputAddress === 0) continue;
            var value = DMXService.readChannel(this.channels[i].inputAddress);
            if(value === this.values[i]) continue; // TODO could interfer with virtual master (not the same value as input)
            // console.log(value + " "+ this.values[i]);
            hasChanged = true;
            for(let j = 0; j < this.channelMultiplier; j++) {
                this.writeChannel(j*this.channels.length+i, value);
            }
        }
        return hasChanged;
        // if(update) DMXService.update();
    }
}