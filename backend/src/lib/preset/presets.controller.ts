
import { Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PresetService } from './presets.service';

@Controller('presets')
export class PresetController {
  constructor(private presetService: PresetService) {}
    
  @Patch()
  add() { // TODO Querrys
    // return this.presetService.addPreset(); // TODO convert to preset
  }

  @Delete()
  remove(@Query("presetId") presetId) {
    if(!presetId) return 'REQUEST-ERROR: presetId is invalid';
    return this.presetService.removePreset(presetId);
  }

  @Put()
  update(@Query("presetId") presetId) { // TODO Querries
    if(!presetId) return 'REQUEST-ERROR: presetId is invalid';
    // return this.presetService.updatePreset(presetId, ); // TODO convert to preset
  }
  
  @Get("presets")
  getPresets() {
    let presets = this.presetService.getPresets();
    // TODO return
  }

  @Put("preset")
  activatePreset(@Query("presetId") presetId) {
    if(!presetId) return 'REQUEST-ERROR: presetId is invalid';
    this.presetService.activatePreset(presetId);
  }
}