import { Module } from '@nestjs/common';
import { DMXService } from './dmx.service';
import { DeviceModule } from '../device/device.module';
import { DeviceService } from '../device/device.service';

@Module({
    // imports: [DeviceModule],
    providers: [DMXService],
    // exports: [DMXService]
})
export class DMXModule {}