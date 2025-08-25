import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from 'ng-zorro-antd/form';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  imports: [
    NzSpinComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzColDirective,
    NzRowDirective,
    ReactiveFormsModule,
    NzFormControlComponent,
    NzInputDirective,
    NzButtonComponent,
    RouterLink,
    NgIf
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup;
  isSpinning: boolean = false;

  constructor(private fb: FormBuilder, private service: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
      ]],
      confirmPassword: [null, [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password');
    const confirm = group.get('confirmPassword');
    if (!password || !confirm) {
      return null;
    }

    if (confirm.errors && !confirm.errors['confirm']) {
      return null;
    }

    if (password.value !== confirm.value) {
      confirm.setErrors({ confirm: true });
      return { confirm: true };
    } else {
      confirm.setErrors(null);
      return null;
    }
  };


  signup(){
    if (this.signupForm.invalid) {
      Object.values(this.signupForm.controls).forEach(control => control.markAsDirty());
      this.signupForm.updateValueAndValidity();
      return;
    }
    console.log(this.signupForm.value);

    this.service.signup(this.signupForm.value).subscribe((res) => {
      console.log(res);
      this.router.navigateByUrl("/login");
    });
  }
}
