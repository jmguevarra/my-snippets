import { FormControl, Validators } from '@angular/forms';
import { MinValueValidator, MaxValueValidator } from './validators';

export class ExampleForm {
  valueControl = new FormControl(null, [Validators.required, new MinValueValidator(0), new MaxValueValidator(100)]);
}
