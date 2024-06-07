import { Injectable } from "@nestjs/common";
import { Preset } from "./classes/preset";

@Injectable()
export class PresetService {
    private presets : Preset[];

    private getPresetIterator(presetId : number) : number {
        for(let i = 0; i < this.presets.length; i++)
          if(this.presets[i].getPresetId() == presetId) return i;
        return -1;
    }  

    private isValidPresetId(presetId : number) : boolean {
        return this.getPresetIterator(presetId) !==-1;
    }

    public getPresets() {
        return this.presets;
    }  

    public addPreset(preset : Preset) {
        if(preset === null) return "ERROR: preset parameters are invalid";  // TODO check if working
        this.presets.push(preset);

        console.log("added preset: "+preset);

        return "STATUS: successful added preset";
    }
    
    public removePreset(presetId : number) {
        if(!this.isValidPresetId(presetId)) return "ERROR: presetId not found";
        this.presets.splice(this.getPresetIterator(presetId), 1);
        return "STATUS: successful removed preset";
    }
      
    public updatePreset(presetId : number, updatedPreset : Preset) { 
        if(!this.isValidPresetId(presetId)) return "ERROR: presetId not found";
        if(updatedPreset === null) return "ERROR: updated preset parameters are invalid" // TODO check if working
        this.presets.splice(this.getPresetIterator(presetId), 1, updatedPreset);
        return "STATUS: successful updated preset";
    }

    public activatePreset(presetId : number) {
        if(!this.isValidPresetId(presetId)) return "ERROR: presetId not found";
        this.presets[this.getPresetIterator(presetId)].load();
        return "STATUS: successful loaded preset "+presetId;
    }
}