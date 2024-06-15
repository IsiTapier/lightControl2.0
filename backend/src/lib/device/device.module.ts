import { Module, forwardRef } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MovingHeadModule } from '../movingHead/movingHead.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { DeviceSchema } from './dto/device.dto';

@Module({
  imports: [
    forwardRef(() => MovingHeadModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: "devices", schema: DeviceSchema }]),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})

export class DeviceModule {} 