import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { MovingHead } from './classes/movingHead';
import { DeviceService } from '../device/device.service';
import { MovingHeadDto } from './dto/movingHead.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from '../device/classes/channel';
import { ChannelType } from '../device/types/channelType';
import { DMXService } from '../dmx/dmx.service';
import { Position } from './classes/position';

@Injectable()
export class MovingHeadService {
  private readonly logger = new Logger(MovingHeadService.name);
  private movingHeads : MovingHead[] = [];
  private loaded : Promise<void>;

  constructor(
    @Inject(forwardRef(() => DeviceService)) private readonly deviceService : DeviceService,
    @InjectModel("movingHeads") private readonly movingHeadModel: Model<MovingHeadDto>,
  ) {
    this.loaded = this.loadDB();
  }

  private addDB(createMovingHeadDto: MovingHeadDto) {
    const createdMovingHead = new this.movingHeadModel(createMovingHeadDto);

    this.logger.log('New moving head: '+createdMovingHead._id+' added to DB');
    return createdMovingHead.save();  // TODO debug if successfull
  }
  
  private removeDB(id : string) {
    return this.movingHeadModel.findByIdAndDelete(id).exec();    // TODO debug if successfull
  }

  private updateDB(updateMovingHeadDto /*: MovingHeadDto*/) {  // TODO movingHead DTO Object with optional paramters
    return this.movingHeadModel.findByIdAndUpdate(updateMovingHeadDto._id, updateMovingHeadDto).exec();    // TODO debug if successfull
  }

  private getDB(): Promise<MovingHeadDto[]> {
    return this.movingHeadModel.find().exec();
  }

  /*async findOne(id: ObjectId) : Promise<MovingHeadDto> {
    // return this.movingHeadModel.findOne({ _id: id }).populate('device', '', this.deviceModel).exec();
    return this.movingHeadModel.findById(id).exec();
  }*/

  /*async findByName(name: string) : Promise<any> {
    let device = await this.deviceModel.findOne({name: name});
    if(!device) return "ERROR: No device with name "+name+" found";  // TODO proper ERROR
    return this.movingHeadModel.findOne({ device: device._id}).populate('device', '', this.deviceModel).exec();
  }*/

  /*async findIdByName(name: string) {
    return (await this.findByName(name))._id;
  }*/

  private async loadDB() : Promise<void> {
    let dbMovingHeads = await this.getDB();
    await this.deviceService.isLoaded();

    for(let mh of dbMovingHeads) this.logger.debug(this.addMovingHead(mh, false)); // TODO Debug if addDevice throws ERROR

    this.logger.log(this.movingHeads.length+ " Moving Heads loaded from DB");

    // TEMP
    // return;
    this.addMovingHead(new MovingHeadDto(-494.6, -467.8, 701.5, 0, 21-2, 540, 240, "MH1", 1,  [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom), new Channel(ChannelType.Intensity, 101), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, /* TODO 508*/0, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()])); // TODO shorter  // TODO negative pan offset
    this.addMovingHead(new MovingHeadDto(-338.6, -467.8, 685.5, 0, 23.5, 540, 240, "MH2", 14, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom), new Channel(ChannelType.Intensity, 103), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, /* TODO 508*/0, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto(-177.9, -467.8, 666.7, 0, 20.5, 540, 240, "MH3", 27, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom), new Channel(ChannelType.Intensity, 105), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, /* TODO 508*/0, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto( 172.9, -467.8, 624.1, 0, 21.2, 540, 240, "MH4", 40, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom), new Channel(ChannelType.Intensity, 112), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, /* TODO 508*/0, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto( 332.4, -467.8, 604.1, 0, 19.9, 540, 240, "MH5", 53, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom), new Channel(ChannelType.Intensity, 114), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, /* TODO 508*/0, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto( 495.7, -467.8, 581.6, 0, 23.5, 540, 240, "MH6", 66, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom), new Channel(ChannelType.Intensity, 116), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, /* TODO 508*/0, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));

    // this.delete("666da5b0f655b391b99ca485");
  }

  private getMhIterator(mhId : string) : number {
    for(let i = 0; i < this.movingHeads.length; i++)
      if(this.movingHeads[i].getMhId() == mhId) return i;
    return -1;
  }

  public isLoaded() : Promise<void> {
    return this.loaded;
  }

  public isValidMhId(mhId: string) : boolean {
    return this.getMhIterator(mhId) !== -1
  }

  public getMovingHeads() : MovingHead[] {
    return this.movingHeads;
  }
  
  public getMovingHead(mhId : string) : MovingHead {
    if(!this.isValidMhId(mhId)) return null;  // TODO Error ???
    return this.movingHeads[this.getMhIterator(mhId)];
  }

  public findMovingHeadId(deviceId : string) : string {
    for(let mh of this.movingHeads)
      if(mh.getDeviceId() === deviceId) return mh.getMhId();
    return null;
  }
  
  public addMovingHead(movingHeadDto : MovingHeadDto, addDB : boolean = true) : string | void {
    if(this.isValidMhId(movingHeadDto._id)) return this.logger.error('moving head id already exists');
    let mh = new MovingHead(movingHeadDto);
    let result = this.deviceService.addDevice(movingHeadDto.device, addDB);
    if(!result) return "ERROR: Device not valid"; // TODO test

    if(addDB) this.addDB(movingHeadDto); // TODO Test

    this.movingHeads.push(mh);
    mh.initMh(); 

    if(addDB) this.logger.log('successful added "'+movingHeadDto.device.name+'" on channel '+mh.getStartAddress()+' to '+mh.getEndAddress());
    return 'STATUS: successful added "'+movingHeadDto.device.name+'" on channel '+mh.getStartAddress()+' to '+mh.getEndAddress();
  }

  public removeMovingHead(mhId : string) : string | void {
    if(!this.isValidMhId(mhId)) return this.logger.error('mhId not found');
    
    this.logger.debug("remove MovingHead "+mhId);
    
    this.removeDB(mhId);

    let mh = this.getMovingHead(mhId);
    this.movingHeads.splice(this.getMhIterator(mhId), 1);
    if(this.deviceService.isValidDeviceId(mh.getDeviceId())) this.deviceService.removeDevice(mh.getDeviceId());

    this.logger.log('successful removed moving head');
    return "STATUS: successful removed moving head";
  }

  public updateMovingHead(updateMhDto : MovingHeadDto) : string | void { // TODO check if type not mh
    let id = updateMhDto._id;
    if(!this.isValidMhId(id)) return this.logger.error('mhId not found');
    if(this.getMovingHead(id).isEqualToMh(updateMhDto)) return this.logger.error('updated moving head is equal to old one');
    let updatedMh = new MovingHead(updateMhDto);
    if(!this.deviceService.isValidDeviceAddress(updatedMh)) return this.logger.error('updated moving head address range overlaps with existing device');
    if(!this.deviceService.updateDevice(updateMhDto.device)) return this.logger.error('updated Device not valid');
    
    this.logger.debug("update moving head "+id);

    this.updateDB(updateMhDto);

    this.movingHeads.splice(this.getMhIterator(id), 1, updatedMh);
    updatedMh.initMh();

    this.logger.log('successful updated moving head');
    return "STATUS: successful updated moving head";
  }

  public setChannel(mhId : string, channel : number, value : number) : string {
    if(!this.isValidMhId(mhId)) return 'ERROR: mhId not found';
    return this.getMovingHead(mhId).writeChannel(channel, value, true);  // TODO update ??
  }

  /*public update() : void {  // TODO neccessary ???
    let hasChanged = false;
    for(let mh of this.movingHeads)
      hasChanged = mh.update() || hasChanged;
    if(hasChanged) DMXService.update();
  }*/

  public getPositions() : Position[] {
    let positions = [];

    for(let mh of this.movingHeads)
      positions.push({id: mh.getMhId(), position: mh.getPosition()});

    return positions;
  }

  public setPosition(mhId : string, position : Position) : string {
    if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";

    this.getMovingHead(mhId).setPosition(position);

    return "STATUS: successful set Position to ( "+position.x+" | "+position.y+" | "+position.height+" )";
  }

  public goHome(mhId : string) {
    if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
    
    this.getMovingHead(mhId).goHome();

    return "STATUS: Successful Activated Home Point"
  }

  public setHome(mhId : string, position : Position) {
    if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";

    let mh = this.getMovingHead(mhId);
    let home = mh.getHome();
    mh.setHome(position);
    let newHome = mh.getHome();
    if(JSON.stringify(newHome) !== JSON.stringify(home))
      this.updateDB({_id : mh.getMhId(), home: newHome});  // TODO more tidy coding

    return "STATUS: successful set new Home Point";
  }
}