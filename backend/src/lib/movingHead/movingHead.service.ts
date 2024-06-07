import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { MovingHead } from './classes/movingHead';
import { DeviceService } from '../device/device.service';

@Injectable()
export class MovingHeadService {
    constructor(
      @Inject(forwardRef(() => DeviceService))
      private deviceService : DeviceService
    ) {}

    private movingHeads : MovingHead[] = [];

    private getMhIterator(mhId : number) : number {
      for(let i = 0; i < this.movingHeads.length; i++)
        if(this.movingHeads[i].getMhId() == mhId) return i;
      return -1;
    }

    private isValidMhId(mhId: number) : boolean {
        return this.getMhIterator(mhId) !== -1
    }
  
    public getMovingHeads() {
      return this.movingHeads;
    }
    
    public addMovingHead(mh : MovingHead) {
      if(!mh.getMhId()) return "ERROR: moving head parameters are invalid";
      let result = this.deviceService.addDevice(mh);
      if(result.includes("ERROR")) return result;
  
      this.movingHeads.push(mh);
      mh.initMh();

      // console.log("added moving head: "+mh);
  
      // TODO MovingHead init
  
      return "STATUS: successful added moving head";
    }
  
    public removeMovingHead(mhId : number) : String {
      if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
      // console.log("remove MovingHead "+mhId);
      let mh = this.getMovingHead(mhId);
      this.movingHeads.splice(this.getMhIterator(mhId), 1);
      this.deviceService.removeDevice(mh.getDeviceId());

      return "STATUS: successful removed moving head";
    }
  
    public updateMovingHead(mhId : number, updatedMh : MovingHead) {
      if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
      if(updatedMh === null) return "ERROR: updated moving head parameters are invalid" // TODO check if working
      this.movingHeads.splice(this.getMhIterator(mhId), 1, updatedMh);
      this.deviceService.updateDevice(this.getMovingHead(mhId).getDeviceId(), updatedMh);
      return "STATUS: successful updated moving head";
    }
  
    public setChannel(mhId : number, channel : number, value : number) {
      if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
      return this.movingHeads[this.getMhIterator(mhId)].writeChannel(channel, value, true);  // TODO update ??
    }
  
    public update() {
      for(let mh of this.movingHeads) mh.update();
    }
  
    public getMovingHead(mhId : number) : MovingHead {
      if(!this.isValidMhId(mhId)) return null;
      return this.movingHeads[this.getMhIterator(mhId)];
    }
  
}