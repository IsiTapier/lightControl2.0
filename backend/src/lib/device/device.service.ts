
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DMXDevice } from './classes/dmxDevice';
import { DMXService } from '../dmx/dmx.service';
import { DeviceType } from './types/deviceType';
import { MovingHeadService } from '../movingHead/movingHead.service';
import { MovingHead } from '../movingHead/classes/movingHead';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(forwardRef(() => MovingHeadService))
    private movingHeadService : MovingHeadService
  ) {}

  private devices : DMXDevice[] = [];
  
  private getDeviceIterator(deviceId : number) : number {
    for(let i = 0; i < this.devices.length; i++)
      if(this.devices[i].getDeviceId() == deviceId) return i;
    return -1;
  }

  private isValidDeviceId(deviceId : number) : boolean {
    return this.getDeviceIterator(deviceId) !== -1;
  }

  public getDevices() {
    return this.devices;
  }
  
  public addDevice(device : DMXDevice, update : boolean = true) {
    if(!device.getDeviceId()) return "ERROR: device parameters are invalid";
    
    for(let d of this.devices) {
      if(device.getStartAddress() >= d.getStartAddress() && device.getStartAddress() <= d.getEndAddress() || device.getStartAddress() <= d.getStartAddress() && device.getEndAddress() >= d.getStartAddress()) 
        return "ERROR: device address range overlaps with existing device"
    }

    this.devices.push(device);
    // TEMP DEBUG
    // console.log(device.getDeviceId());

    device.init(false); // TODO maybe update false in order to prevent flicker on start up (give time to update values)
    // TODO device init

    // console.log("added device: "+device);

    return "STATUS: successful added device";
  }

  public removeDevice(deviceId : number) : String {
    if(!this.isValidDeviceId(deviceId)) return "ERROR: deviceId not found";
    // console.log("remove device "+deviceId);
    let device = this.getDevice(deviceId);
    this.devices.splice(this.getDeviceIterator(deviceId), 1);
    if(device.getType() === DeviceType.MovingHead)
      return (this.movingHeadService.removeMovingHead((<MovingHead>device).getMhId()));
    return "STATUS: successful removed device";
  }
  
  public updateDevice(deviceId : number, updatedDevice : DMXDevice) { 
    if(!this.isValidDeviceId(deviceId)) return "ERROR: deviceId not found";
    if(updatedDevice === null) return "ERROR: updated device parameters are invalid" // TODO check if working
    this.devices.splice(this.getDeviceIterator(deviceId), 1, updatedDevice);
    return "STATUS: successful updated device";
  }

  public setChannel(deviceId : number, channel : number, value : number) {
    if(!this.isValidDeviceId(deviceId)) return "ERROR: deviceId not found";
    return this.devices[this.getDeviceIterator(deviceId)].writeChannel(channel, value, true);  // TODO update DMX ??
    return "STATUS: successful set channel "+channel+" to "+value;
  }

  public update() {
    let hasChanged = false;
    for(let device of this.devices) hasChanged ||= device.update();
    if(hasChanged) DMXService.update();
  }

  public getDevice(deviceId : number) : DMXDevice {
    if(!this.isValidDeviceId(deviceId)) return null; // TODO Error ???
    return this.devices[this.getDeviceIterator(deviceId)];
  }

}