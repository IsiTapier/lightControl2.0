import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { Channel } from 'src/lib/device/classes/channel';
import { DeviceDto } from 'src/lib/device/dto/device.dto';
import { ChannelType } from 'src/lib/device/types/channelType';

export function IsValidMhDevice(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidMhDeviceContraint,
    });
  };
}

// inspiration
// export declare function ValidateIf(condition: (object: any, value: any) => boolean, validationOptions?: ValidationOptions): PropertyDecorator;

@ValidatorConstraint({ name: 'IsValidMhDevice' })
export class IsValidMhDeviceContraint implements ValidatorConstraintInterface {

  validate(device: DeviceDto, args: ValidationArguments) {
    let channels : Channel[] = device.channels;
    if(!channels || channels.length < 2) return false;
    let hasPan : boolean, hasTilt : boolean = false; 
    for(let channel of channels) {
      if(channel.type === ChannelType.Pan ) hasPan  = true;
      if(channel.type === ChannelType.Tilt) hasTilt = true;
    }
    return hasPan && hasTilt;
  }
}