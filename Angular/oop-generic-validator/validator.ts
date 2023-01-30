import { Validator, AbstractControl, ValidationErrors } from '@angular/forms';

export class MinValueValidator implements Validator {
  constructor(private min: number) {}

  validate(control: AbstractControl): ValidationErrors | null {
    const isInvalid = control.value !== null && control.value < this.min;
    return isInvalid ? { 'minValue': { value: control.value } } : null;
  }
}

export class MaxValueValidator implements Validator {
  constructor(private max: number) {}

  validate(control: AbstractControl): ValidationErrors | null {
    const isInvalid = control.value !== null && control.value > this.max;
    return isInvalid ? { 'maxValue': { value: control.value } } : null;
  }
}
