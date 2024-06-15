
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DMXDevice } from './classes/dmxDevice';
import { DMXService } from '../dmx/dmx.service';
import { DeviceType } from './types/deviceType';
import { MovingHeadService } from '../movingHead/movingHead.service';
import { MovingHead } from '../movingHead/classes/movingHead';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { DeviceDto } from './dto/device.dto';
import { Channel } from './classes/channel';
import { ChannelType } from './types/channelType';

@Injectable()
export class DeviceService {
  private devices : DMXDevice[] = [];

  constructor(
    @Inject(forwardRef(() => MovingHeadService)) private movingHeadService : MovingHeadService,
    @InjectModel("devices") private readonly deviceModel: Model<DeviceDto>,
  ) {
    this.loadDB(); 
  }

  private addDB(createDeviceDto : DeviceDto) {
    const createdDevice = new this.deviceModel(createDeviceDto);
    // TEMP
    console.log(createdDevice._id);
    return createdDevice.save();
  }

  private removeDB(id : string) {
    let _id = new mongo.ObjectId(id);
    return this.deviceModel.findByIdAndDelete(_id).exec();
  } 
  
  private updateDB(id : string, updateDeviceDto : DeviceDto) {
    let _id = new mongo.ObjectId(id);
    this.deviceModel.findByIdAndUpdate(_id, updateDeviceDto).exec();
  }

  private getDB(): Promise<DeviceDto[]> { // find all
    return this.deviceModel.find().exec();
  }
  
  private async loadDB() {
    let dbDevices = await this.getDB();
    for(let device of dbDevices) if(device.type !== DeviceType.MovingHead) console.log(await this.addDevice(device, false)); // TODO Debug if addDevice throws ERROR

    console.log(this.devices.length+" Devices loaded from DB");

    // TEMP
    this.addDevice(new DeviceDto("test2", DeviceType.Par, 83, [new Channel(ChannelType.Red, 1, 200), new Channel(ChannelType.Green, 2, 20), new Channel(ChannelType.Blue, 3)]));
    this.updateDB(this.devices[this.devices.length-1].getDeviceId(), {name: "test"});
  }

  
  private getDeviceIterator(deviceId : string) : number {
    for(let i = 0; i < this.devices.length; i++)
      if(this.devices[i].getDeviceId() == deviceId) return i;
    return -1;
  }

  private isValidDeviceId(deviceId : string) : boolean {
    return this.getDeviceIterator(deviceId) !== -1;
  }

  public getDevices() {
    return this.devices;
  }
  
  public async addDevice(deviceDto : DeviceDto, addDB : boolean = true, update : boolean = true) {
    let device = new DMXDevice(deviceDto);
    if(!device.isValid()) return "ERROR: device parameters are invalid";
    for(let d of this.devices) {
      if(device.getStartAddress() >= d.getStartAddress() && device.getStartAddress() <= d.getEndAddress() || device.getStartAddress() <= d.getStartAddress() && device.getEndAddress() >= d.getStartAddress()) 
        return "ERROR: device address range overlaps with existing device"
    }

    if(addDB && deviceDto.type !== DeviceType.MovingHead) this.addDB(deviceDto);
    
    this.devices.push(device);
    device.init(false); // TODO maybe update false in order to prevent flicker on start up (give time to update values)

    console.log("added device: "+device);

    return "STATUS: successful added device";
  }

  public getDevice(deviceId : string) : DMXDevice {
    if(!this.isValidDeviceId(deviceId)) return null; // TODO Error ???
    return this.devices[this.getDeviceIterator(deviceId)];
  }

  public removeDevice(deviceId : string) : String {
    if(!this.isValidDeviceId(deviceId)) return "ERROR: deviceId not found";
    // console.log("remove device "+deviceId);
    let device = this.getDevice(deviceId);
    this.devices.splice(this.getDeviceIterator(deviceId), 1);
    if(device.getType() === DeviceType.MovingHead)
      return (this.movingHeadService.removeMovingHead((<MovingHead>device).getMhId()));
    return "STATUS: successful removed device";
  }
  
  public updateDevice(deviceId : string, updatedDevice : DMXDevice) { 
    if(!this.isValidDeviceId(deviceId)) return "ERROR: deviceId not found";
    if(updatedDevice === null) return "ERROR: updated device parameters are invalid" // TODO check if working
    this.devices.splice(this.getDeviceIterator(deviceId), 1, updatedDevice);
    return "STATUS: successful updated device";
  }

  public setChannel(deviceId : string, channel : number, value : number) {
    if(!this.isValidDeviceId(deviceId)) return "ERROR: deviceId not found";
    return this.devices[this.getDeviceIterator(deviceId)].writeChannel(channel, value, true);  // TODO update DMX ??
    return "STATUS: successful set channel "+channel+" to "+value;
  }

  public update() {
    let hasChanged = false;
    for(let device of this.devices) hasChanged ||= device.update();
    if(hasChanged) DMXService.update();
  }
}