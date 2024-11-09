import { Injectable, Logger } from "@nestjs/common";
import { Preset } from "./classes/preset";
import { InjectModel } from "@nestjs/mongoose";
import { PresetDto } from "./dto/preset.dto";
import { Model } from "mongoose";
import { MovingHeadService } from "../movingHead/movingHead.service";
import { Position } from "../movingHead/classes/position";

@Injectable()
export class PresetService {
    private readonly logger = new Logger(PresetService.name);
    private presets : Preset[] = [];
    private loaded : Promise<void>;
  
    constructor(
      private readonly movingHeadService : MovingHeadService,
      @InjectModel("presets") private readonly presetModel: Model<PresetDto>,
    ) {
      this.loaded = this.loadDB();
    }
  
    private addDB(createPresetDto: PresetDto) {
      const createdPreset = new this.presetModel(createPresetDto);

      this.logger.log('New preset: '+createdPreset._id+' added to DB');
      return createdPreset.save();  // TODO debug if successfull
    }
    
    private removeDB(id : string) {
      return this.presetModel.findByIdAndDelete(id).exec();    // TODO debug if successfull
    }
  
    private updateDB(updatePresetDto : PresetDto) {
      return this.presetModel.findByIdAndUpdate(updatePresetDto._id, updatePresetDto).exec();    // TODO debug if successfull
    }
  
    private getDB(): Promise<PresetDto[]> {
      return this.presetModel.find().exec();
    }

    private async loadDB() : Promise<void> {
      let dbPresets = await this.getDB();
      await this.movingHeadService.isLoaded();

      for(let preset of dbPresets) this.logger.debug(this.addPreset(preset, false)); // TODO Debug if addPreset throws ERROR

      this.logger.log(this.presets.length+ " Presets loaded from DB");

      // TEMP
      return;
      let preset = new Map<string, Position>();
      preset.set("6727c30c0bd3d403fddb6d52", new Position(10, 5, 10));
      this.addPreset(new PresetDto('Preset', preset));

      preset.set("6727c30c0bd3d403fddb6d52", new Position(10, 160, 10));
      preset.set("6727c30c0bd3d403fddb6d54", new Position(500, 7, 10));
      this.updatePreset({_id: "6727d0760ec94407a51da42d", name: "Preset", positions: preset});
      this.removePreset("6727d04f498322347a847198");

      this.activatePreset("6727d0760ec94407a51da42d")
    }
  
    private getPresetIterator(presetId : string) : number {
      for(let i = 0; i < this.presets.length; i++)
        if(this.presets[i].getPresetId() == presetId) return i;
      return -1;
    }

    public isValidPresetId(presetId: string) : boolean {
      return this.getPresetIterator(presetId) !== -1
    }

    public filterValidPositions(positions: Map<string, Position>): Map<string, Position> {
      // TODO check that moving heads in storage match DB
      positions.forEach((position, mhId) => {
        if(!this.movingHeadService.isValidMhId(mhId)) positions.delete(mhId);
      });
      return positions;
    }

    public getPresets() : Preset[] {
      return this.presets;
    }
    
    public getPreset(presetId : string) : Preset {
      if(!this.isValidPresetId(presetId)) return null;  // TODO Error ???
      return this.presets[this.getPresetIterator(presetId)];
    }

    // maybe obsolute
    public createNewPreset(ids : string[]) {
        let positions = new Map<string, Position>();
        for(let id of ids) { // TODO
            let mh = this.movingHeadService.getMovingHead(id);
            if(mh === null) continue;

            positions.set(id, mh.getPosition());
        }
        if(positions.size === 0) return null;

        return new PresetDto('Preset', positions);
    }
    
    public addPreset(presetDto : PresetDto, addDB : boolean = true) : string | void {
      if(this.isValidPresetId(presetDto._id)) return this.logger.error('preset id already exists');
      let preset = new Preset(presetDto);

      this.filterValidPositions(preset.getPositions());
      
      if(!preset.isValid()) {
        if(!addDB) this.removeDB(preset.getPresetId());
        return this.logger.error('Preset is not valid'+(!addDB?'. it will be deleted':''));
      }
    
      if(addDB) this.addDB(presetDto);
  
      this.presets.push(preset);
  
      if(addDB) this.logger.log("successful added preset");
      return "STATUS: successful added preset";
    }
  
    public removePreset(presetId : string) : string | void {
      if(!this.isValidPresetId(presetId)) return this.logger.error('presetId not found');
      
      this.logger.debug("remove preset "+presetId);
      
      this.removeDB(presetId);
  
      this.presets.splice(this.getPresetIterator(presetId), 1);
  
      this.logger.log('successful removed preset');
      return "STATUS: successful removed preset";
    }

    public updatePreset(updatePresetDto : PresetDto) : string | void { // TODO check if type not preset
      let id = updatePresetDto._id;
      if(!this.isValidPresetId(updatePresetDto._id)) return this.logger.error('presetId not found');
      
      
      if(this.getPreset(id).isEqualToPreset(updatePresetDto)) return this.logger.error('updated preset is equal to old one');
      
      let updatedPreset = new Preset(updatePresetDto);
      this.filterValidPositions(updatedPreset.getPositions());
      if(!updatedPreset.isValid()) return this.logger.error('updated preset is invalid');
      
      this.logger.debug("update preset "+id);
  
      this.updateDB(updatePresetDto);
  
      this.presets.splice(this.getPresetIterator(id), 1, updatedPreset);
  
      this.logger.log('successful updated preset');
      return "STATUS: successful updated preset";
    }

    public activatePreset(presetId : string) {
      if(!this.isValidPresetId(presetId)) return "ERROR: presetId not found";
      for(let [mhId, position] of this.presets[this.getPresetIterator(presetId)].getPositions()) {
        this.movingHeadService.setPosition(mhId, position);
      }
      this.logger.debug("activated preset "+presetId)
      return "STATUS: successful loaded preset "+presetId;
    }
}