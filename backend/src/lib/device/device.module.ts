import { Module, forwardRef } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MovingHeadModule } from '../movingHead/movingHead.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { DeviceSchema } from './dto/device.dto';
import { IsAvailableDMXAddressConstraint } from './util/addressValidator';
import { IsValidIdConstraint } from './util/idValidator';

@Module({
  imports: [
    forwardRef(() => MovingHeadModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: "devices", schema: DeviceSchema }]),
  ],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    IsAvailableDMXAddressConstraint,
    IsValidIdConstraint,
  ],
  exports: [DeviceService],
})

export class DeviceModule {} 