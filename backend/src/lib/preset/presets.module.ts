import { forwardRef, Module } from '@nestjs/common';
import { PresetService } from './presets.service';
import { PresetController } from './presets.controller';
import { MovingHeadModule } from '../movingHead/movingHead.module';
import { PresetSchema } from './dto/preset.dto';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MovingHeadModule,
        MongooseModule.forFeature([{ name: "presets", schema: PresetSchema }]),
    ],
    controllers: [PresetController],
    providers: [PresetService],
    exports: [PresetService]
})
export class PresetModule {}
