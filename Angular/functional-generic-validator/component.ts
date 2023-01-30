import { FormControl, Validators } from '@angular/forms';
import { minValueValidator, maxValueValidator } from './validators';

export class ExampleForm {
  valueControl = new FormControl(null, [Validators.required, minValueValidator(0), maxValueValidator(100)]);
}
