import { Module, forwardRef } from '@nestjs/common';
import { MovingHeadController } from './movingHead.controller';
import { MovingHeadService } from './movingHead.service';
import { DeviceModule } from '../device/device.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MovingHeadSchema } from './dto/movingHead.dto';

@Module({
    imports: [
        forwardRef(() => DeviceModule),
        MongooseModule.forFeature([{ name: "movingHeads", schema: MovingHeadSchema }]),
    ],
    controllers: [MovingHeadController],
    providers: [MovingHeadService],
    exports: [MovingHeadService]
})
export class MovingHeadModule {}
