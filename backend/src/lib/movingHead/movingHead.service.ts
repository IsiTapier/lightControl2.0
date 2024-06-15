import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { MovingHead } from './classes/movingHead';
import { DeviceService } from '../device/device.service';
import { MovingHeadDto } from './dto/movingHead.dto';
import { Model, mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from '../device/classes/channel';
import { ChannelType } from '../device/types/channelType';

@Injectable()
export class MovingHeadService {
  private movingHeads : MovingHead[] = [];

  constructor(
    @Inject(forwardRef(() => DeviceService)) private deviceService : DeviceService,
    @InjectModel("movingHeads") private readonly movingHeadModel: Model<MovingHeadDto>,
  ) {
    this.loadDB();
  }


  private addDB(createMovingHeadDto: MovingHeadDto) {
    // return new this.movingHeadModel(createMovingHeadDto);
    /*let device = await new this.deviceModel(createMovingHeadDto.device);
    let mho = await new this.movingHeadModel(createMovingHeadDto);
    // mho.device = device;
    await device.save();
    await mho.save();
    console.log(mho._id);
    console.log(await this.findOne(mho._id));*/

    const createdMovingHead = new this.movingHeadModel(createMovingHeadDto);
    // TEMP
    console.log(createdMovingHead._id);
    createdMovingHead.save();
    return createdMovingHead._id;
  }
  
  private removeDB(id : string) {
    let _id = new mongo.ObjectId(id);
    return this.movingHeadModel.findByIdAndDelete(_id).exec();
  }

  private updateDB(id : string, updateMovingHeadDto : MovingHeadDto) {
    let _id = new mongo.ObjectId(id);
    this.movingHeadModel.findByIdAndUpdate(_id, updateMovingHeadDto).exec();
  }

  async getDB(): Promise<MovingHeadDto[]> {
    // return this.movingHeadModel.find().populate('device', '', this.deviceModel).exec();
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

  private async loadDB() {
    let dbMovingHeads = await this.movingHeadModel.find().exec();
    for(let mh of dbMovingHeads) console.log(await this.addMovingHead(mh, false)); // TODO Debug if addDevice throws ERROR

    console.log(this.movingHeads.length+ " Moving Heads loaded from DB");

    // TEMP
    this.addMovingHead(new MovingHeadDto(-494.6, -467.8, 701.5, 0, 21-2, 540, 240, "MH1", 1,  [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 102), new Channel(ChannelType.Intensity, 101), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()])); // TODO shorter  // TODO negative pan offset
    this.addMovingHead(new MovingHeadDto(-338.6, -467.8, 685.5, 0, 23.5, 540, 240, "MH2", 14, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 104), new Channel(ChannelType.Intensity, 103), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto(-177.9, -467.8, 666.7, 0, 20.5, 540, 240, "MH3", 27, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 106), new Channel(ChannelType.Intensity, 105), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto( 172.9, -467.8, 624.1, 0, 21.2, 540, 240, "MH4", 40, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 113), new Channel(ChannelType.Intensity, 112), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto( 332.4, -467.8, 604.1, 0, 19.9, 540, 240, "MH5", 53, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 115), new Channel(ChannelType.Intensity, 114), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));
    this.addMovingHead(new MovingHeadDto( 495.7, -467.8, 581.6, 0, 23.5, 540, 240, "MH6", 66, [new Channel(ChannelType.Pan), new Channel(ChannelType.Tilt), new Channel(ChannelType.PTSpeed), new Channel(ChannelType.Zoom, 117), new Channel(ChannelType.Intensity, 116), new Channel(ChannelType.Effect, 0, 255), new Channel(ChannelType.White), new Channel(ChannelType.WarmWhite), new Channel(ChannelType.ColorTemp, 508, 50), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel(ChannelType.None), new Channel()]));

    // this.delete("666da5b0f655b391b99ca485");
  }

  private getMhIterator(mhId : string) : number {
    for(let i = 0; i < this.movingHeads.length; i++)
      if(this.movingHeads[i].getMhId() == mhId) return i;
    return -1;
  }

  private isValidMhId(mhId: string) : boolean {
      return this.getMhIterator(mhId) !== -1
  }

  public getMovingHeads() {
    return this.movingHeads;
  }
  
  public async addMovingHead(movingHeadDto : MovingHeadDto, addDB : boolean = true) {
    let mh = new MovingHead(movingHeadDto);
    if(!mh.isValid()) return "ERROR: moving head parameters are invalid";
    let result = await this.deviceService.addDevice(movingHeadDto.device, addDB);
    if(result.includes("ERROR")) return result;

    if(addDB) this.addDB(movingHeadDto);

    this.movingHeads.push(mh);
    mh.initMh(); 

    console.log("added moving head: "+mh);

    return "STATUS: successful added moving head";
  }

  public removeMovingHead(mhId : string) : String {
    if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
    // console.log("remove MovingHead "+mhId);
    let mh = this.getMovingHead(mhId);
    this.movingHeads.splice(this.getMhIterator(mhId), 1);
    this.deviceService.removeDevice(mh.getDeviceId());

    return "STATUS: successful removed moving head";
  }

  public updateMovingHead(mhId : string, updatedMh : MovingHead) {
    if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
    if(updatedMh === null) return "ERROR: updated moving head parameters are invalid" // TODO check if working
    this.movingHeads.splice(this.getMhIterator(mhId), 1, updatedMh);
    this.deviceService.updateDevice(this.getMovingHead(mhId).getDeviceId(), updatedMh);
    return "STATUS: successful updated moving head";
  }

  public setChannel(mhId : string, channel : number, value : number) {
    if(!this.isValidMhId(mhId)) return "ERROR: mhId not found";
    return this.movingHeads[this.getMhIterator(mhId)].writeChannel(channel, value, true);  // TODO update ??
  }

  public update() {
    for(let mh of this.movingHeads) mh.update();
  }

  public getMovingHead(mhId : string) : MovingHead {
    if(!this.isValidMhId(mhId)) return null;
    return this.movingHeads[this.getMhIterator(mhId)];
  }

}