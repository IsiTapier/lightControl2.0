import { Module } from '@nestjs/common';
import { PresetService } from './presets.service';
import { PresetController } from './presets.controller';

@Module({
    imports: [],
    controllers: [PresetController],
    providers: [PresetService],
    exports: [PresetService]
})
export class PresetModule {}
