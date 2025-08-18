import { afterNextRender, Component, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginFormComponent {
  form = viewChild.required<NgForm>('form');

  constructor() {
    afterNextRender(() => {
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next(value) {
            console.log(value);
          },
        });
    });
  }

  onSubmit(formData: NgForm) {
    console.log(formData.form.value.username);
    console.log(formData.form.value.password);
    console.log(formData);
  }
}
