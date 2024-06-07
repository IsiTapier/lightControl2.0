import { Module, forwardRef } from '@nestjs/common';
import { MovingHeadController } from './movingHead.controller';
import { MovingHeadService } from './movingHead.service';
import { DeviceModule } from '../device/device.module';

@Module({
    imports: [forwardRef(() => DeviceModule)],
    controllers: [MovingHeadController],
    providers: [MovingHeadService],
    exports: [MovingHeadService]
})
export class MovingHeadModule {}
