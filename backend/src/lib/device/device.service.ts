
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { DMXDevice } from './classes/dmxDevice';
import { DMXService } from '../dmx/dmx.service';
import { DeviceType } from './types/deviceType';
import { MovingHeadService } from '../movingHead/movingHead.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceDto } from './dto/device.dto'
import { Channel } from './classes/channel';
import { ChannelType } from './types/channelType';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);
  private devices : DMXDevice[] = [];

  constructor(
    @Inject(forwardRef(() => MovingHeadService)) private readonly movingHeadService : MovingHeadService,
    @InjectModel("devices") private readonly deviceModel: Model<DeviceDto>,
  ) {
    this.loadDB(); 
  }

  private addDB(createDeviceDto : DeviceDto) {
    const createdDevice = new this.deviceModel(createDeviceDto);
    
    this.logger.log('New device: '+createdDevice._id);
    return createdDevice.save();   // TODO debug if successfull
  }

  private removeDB(id : string) {
    return this.deviceModel.findByIdAndDelete(id).exec();   // TODO debug if successfull
  }
  
  private updateDB(updateDeviceDto : DeviceDto) {
    return this.deviceModel.findByIdAndUpdate(updateDeviceDto._id, updateDeviceDto).exec();  // TODO debug if successfull
  }

  private getDB(): Promise<DeviceDto[]> {
    return this.deviceModel.find().exec();
  }
  
  private async loadDB() : Promise<void> {
    let dbDevices = await this.getDB();
    for(let device of dbDevices) if(device.type !== DeviceType.MovingHead) this.logger.debug(await this.addDevice(device, false)); // TODO Debug if addDevice throws ERROR

    this.logger.log(this.devices.length+" Devices loaded from DB");

    // TEMP
    return;
    this.addDevice(new DeviceDto("test2", DeviceType.Par, 83, [new Channel(ChannelType.Red, 1, 200), new Channel(ChannelType.Green, 2, 20), new Channel(ChannelType.Blue, 3)]));
    this.updateDB({_id: this.devices[this.devices.length-1].getDeviceId(), name: "test"}); // TODO check if working
  }

  private getDeviceIterator(deviceId : string) : number {
    for(let i = 0; i < this.devices.length; i++)
      if(this.devices[i].getDeviceId() == deviceId) return i;
    return -1;
  }

  public isValidDeviceId(deviceId : string) : boolean {
    return this.getDeviceIterator(deviceId) !== -1;
  }

  public isValidAddress(address : number, endAddress : number = address, deviceId : string = null) : boolean {
    if(address < 1 || endAddress > 512) return false;
    for(let d of this.devices) {
      if(deviceId && d.getDeviceId() === deviceId) continue;
      if(address >= d.getStartAddress() && address <= d.getEndAddress() || address <= d.getStartAddress() && endAddress >= d.getStartAddress()) return false;
    }
    return true;
  }

  public isValidDeviceAddress(device : DMXDevice) : boolean {
    return this.isValidAddress(device.getStartAddress(), device.getEndAddress(), device.getDeviceId());
  }


  public getDevices() : DMXDevice[] {
    return this.devices;
  }

  public getDevice(deviceId : string) : DMXDevice {
    if(!this.isValidDeviceId(deviceId)) return null; // TODO Error ???
    return this.devices[this.getDeviceIterator(deviceId)];
  }
  
  public addDevice(deviceDto : DeviceDto, addDB : boolean = true, update : boolean = true) : string | void { // TODO update
    if(this.isValidDeviceId(deviceDto._id)) return this.logger.error('device id already exists');
    let device = new DMXDevice(deviceDto);
    if(!this.isValidDeviceAddress(device)) return this.logger.error('device address range overlaps with existing device'); // TODO
    
    this.logger.debug("add device: "+device);
    // this.logger.debug(device); 
    
    if(addDB && deviceDto.type !== DeviceType.MovingHead) this.addDB(deviceDto);

    this.devices.push(device);
    device.init(false); // TODO maybe update false in order to prevent flicker on start up (give time to update values)

    this.logger.log('successful added device');
    return 'STATUS: successful added device';
  }

  public removeDevice(deviceId : string) : string | void {
    if(!this.isValidDeviceId(deviceId)) return this.logger.error("deviceId not found");
    
    this.logger.debug("remove device "+deviceId);

    let device = this.getDevice(deviceId);
    
    if(device.getType() !== DeviceType.MovingHead) this.removeDB(deviceId);

    this.devices.splice(this.getDeviceIterator(deviceId), 1);
    device.blackout();

    this.logger.log('successful removed device');

    let mhId = this.movingHeadService.findMovingHeadId(deviceId);
    if(device.getType() === DeviceType.MovingHead && mhId)
      return (this.movingHeadService.removeMovingHead(mhId));

    return 'STATUS: successful removed device';
  }
  
  public updateDevice(updateDeviceDto : DeviceDto) : string | void { // TODO check if called from mh
    let id = updateDeviceDto._id
    if(!this.isValidDeviceId(id)) return this.logger.error('deviceId not found');
    if(this.getDevice(id).isEqualTo(updateDeviceDto)) return this.logger.error('updated device is equal to old one');
    let updatedDevice = new DMXDevice(updateDeviceDto);
    if(!this.isValidDeviceAddress(updatedDevice)) return this.logger.error('updated device address range overlaps with existing device');

    this.logger.debug("update device "+id);

    if(updateDeviceDto.type !== DeviceType.MovingHead) this.updateDB(updateDeviceDto);

    this.getDevice(id).blackout();
    this.devices.splice(this.getDeviceIterator(id), 1, updatedDevice);
    if(updateDeviceDto.type !== DeviceType.MovingHead) updatedDevice.init(false);  // TODO check update

    this.logger.log('successful updated device');
    return 'STATUS: successful updated device';
  }

  public setChannel(deviceId : string, channel : number, value : number) : string {
    if(!this.isValidDeviceId(deviceId)) return 'ERROR: deviceId not found';
    return this.getDevice(deviceId).writeChannel(channel, value, true);  // TODO update DMX ??
  }

  public update() : void {
    let hasChanged = false;
    for(let device of this.devices)
      hasChanged = device.update() || hasChanged;
    if(hasChanged) DMXService.update();
  }
}