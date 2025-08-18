import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function strongPassword(control: AbstractControl) {
  if (control.value?.includes('-')) {
    return null;
  }

  return { containDash: true };
}

function sameValue(controlname1: string, controlname2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlname1)?.value;
    const val2 = control.get(controlname2)?.value;
    if (val1 === val2) {
      return null;
    }
    return { sameValue: true };
  };
}

@Component({
  selector: 'app-login-reactive',
  imports: [ReactiveFormsModule],
  templateUrl: './login-reactive.html',
  styleUrl: './login-reactive.css',
})
export class LoginReactive {
  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(6),
            strongPassword,
          ],
        }),
        confirmpassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(6),
            strongPassword,
          ],
        }),
      },
      {
        validators: [sameValue('password', 'confirmpassword')],
      }
    ),
    firstname: new FormControl('', {
      validators: [Validators.required],
    }),
    lastname: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
      postalcode: new FormControl('', {
        validators: [Validators.required],
      }),
      country: new FormControl<
        '' | 'usa' | 'canada' | 'uk' | 'australia' | 'india'
      >('', {
        validators: [Validators.required],
      }),
    }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    terms: new FormControl(false, {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    console.log(this.form);
  }

  onReset() {
    this.form.reset();
  }
}
