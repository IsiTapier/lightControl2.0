import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DeviceService } from '../device.service';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { MovingHeadService } from 'src/lib/movingHead/movingHead.service';

export function IsAvailableDMXAddress(property: string, property2: string, property3 : string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, property2, property3],
      validator: IsAvailableDMXAddressConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsAvailableDMXAddress' })
@Injectable()
export class IsAvailableDMXAddressConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(forwardRef(() => DeviceService)) private readonly deviceService : DeviceService, @Inject(forwardRef(() => MovingHeadService)) private readonly movingHeadService : MovingHeadService) {}

  validate(value: any, args: ValidationArguments) {
    const [channelsName, channelMultiplierName, idName] = args.constraints;
    const channels = (args.object as any)[channelsName];
    const channelMultiplier = (args.object as Number)[channelMultiplierName];
    let id = (args.object as String)[idName];
    if(this.movingHeadService.isValidMhId(id)) id = this.movingHeadService.getMovingHead(id).getDeviceId();  // TODO Pfusch richtig machen !!!
    try {
      let  address = parseInt(value);
      if(isNaN(address)) return false; 
      let size = channels.length;
      let end = address+size*channelMultiplier-1;
      let result = this.deviceService.isValidAddress(address, end, id);
      return result;
    } catch (e) {
      return false;
    }
  }
}