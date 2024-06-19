import { Module, forwardRef } from '@nestjs/common';
import { MovingHeadController } from './movingHead.controller';
import { MovingHeadService } from './movingHead.service';
import { DeviceModule } from '../device/device.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovingHeadSchema } from './dto/movingHead.dto';
import { PositionController } from './positions.controller';
import { IsValidMhDeviceContraint } from './util/mhDeviceValidator';

@Module({
    imports: [
        forwardRef(() => DeviceModule),
        MongooseModule.forFeature([{ name: "movingHeads", schema: MovingHeadSchema }]),
    ],
    controllers: [
        MovingHeadController,
        PositionController
    ],
    providers: [
        MovingHeadService,
        IsValidMhDeviceContraint
    ],
    exports: [MovingHeadService]
})
export class MovingHeadModule {}
