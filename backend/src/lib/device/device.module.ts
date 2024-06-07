import { Module, forwardRef } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MovingHeadModule } from '../movingHead/movingHead.module';
import { MovingHeadService } from '../movingHead/movingHead.service';

@Module({
  imports: [forwardRef(() => MovingHeadModule)],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})

export class DeviceModule {}