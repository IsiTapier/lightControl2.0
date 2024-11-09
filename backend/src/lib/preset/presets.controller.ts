
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Put } from '@nestjs/common';
import { PresetService } from './presets.service';
import { PresetDto } from './dto/preset.dto';

@Controller('presets')
export class PresetController {
  constructor(private presetService: PresetService) {}
    
  @Patch()
  add(@Body('preset') preset : PresetDto) {
    if(!preset.positions || this.presetService.filterValidPositions(preset.positions).size < 1) 
      throw new HttpException('REQUEST-ERROR: Preset must include at least one valid MH', HttpStatus.BAD_REQUEST);
    return this.presetService.addPreset(preset);
  }

  @Delete(':id')
  remove(@Param('id') presetId : string) {
    if(!presetId || !this.presetService.isValidPresetId(presetId))
      throw new HttpException('REQUEST-ERROR: presetId is invalid', HttpStatus.BAD_REQUEST);
    return this.presetService.removePreset(presetId);
  }

  @Put()
  update(@Body('preset') preset : PresetDto) {
    if(!preset._id || !this.presetService.isValidPresetId(preset._id))
      throw new HttpException('REQUEST-ERROR: presetId is invalid', HttpStatus.BAD_REQUEST);
    if(!preset.positions || this.presetService.filterValidPositions(preset.positions).size < 1) 
      throw new HttpException('REQUEST-ERROR: Preset must include at least one valid MH', HttpStatus.BAD_REQUEST);
    if(this.presetService.getPreset(preset._id).isEqualToPreset(preset))
      throw new HttpException('REQUEST-ERROR: updated preset is equal to old one', HttpStatus.BAD_REQUEST);
    return this.presetService.updatePreset(preset);
  }
  
  @Get()
  getPresets() {
    return this.presetService.getPresets();
  }

  @Get(':id')
  activatePreset(@Param('id') presetId) {
    if(!presetId || !this.presetService.isValidPresetId(presetId))
      throw new HttpException('REQUEST-ERROR: presetId is invalid', HttpStatus.BAD_REQUEST);
    return this.presetService.activatePreset(presetId);
  }
}