import { ValidatorFn, AbstractControl } from '@angular/forms';

export function minValueValidator(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isInvalid = control.value !== null && control.value < min;
    return isInvalid ? { 'minValue': { value: control.value } } : null;
  };
}

export function maxValueValidator(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isInvalid = control.value !== null && control.value > max;
    return isInvalid ? { 'maxValue': { value: control.value } } : null;
  };
}
