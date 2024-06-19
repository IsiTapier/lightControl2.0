import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DeviceService } from '../device.service';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

export enum ValidIdType {
  EXISTS = "EXISTS",
  UNEQUAL = "UNEQUAL",
  AVAILABLE = "AVAILABLE",
};

export function IsValidId(type : ValidIdType, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [type],
      validator: IsValidIdConstraint,
    });
  };
}

// inspiration
// export declare function ValidateIf(condition: (object: any, value: any) => boolean, validationOptions?: ValidationOptions): PropertyDecorator;

@ValidatorConstraint({ name: 'IsValidId' })
@Injectable()
export class IsValidIdConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(forwardRef(() => DeviceService)) private deviceService : DeviceService) {}

  validate(value: any, args: ValidationArguments) {
    const [type] = args.constraints;
    if(type === ValidIdType.EXISTS) {
      if(!this.deviceService.isValidDeviceId(value)) return false;
      return this.deviceService.isValidDeviceId(value);
    }
    if(type === ValidIdType.AVAILABLE) {
      return !this.deviceService.isValidDeviceId(value);
    }
    if(type === ValidIdType.UNEQUAL) {
      if(!this.deviceService.getDevice(value)) return false;
      return !this.deviceService.getDevice(value).isEqualTo(args.object);
    }
    return false;
  }
}