import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth/auth.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StorageService} from '../../services/storage/storage.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzInputDirective,
    NzRowDirective,
    NzSpinComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSpinning: boolean = false;
  private message: NzMessageService;
  private router: Router

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    message: NzMessageService,
    router: Router
  ) {
    this.message = message;
    this.router = router;
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
      ]],
    });
  }

  login(){
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => control.markAsDirty());
      this.loginForm.updateValueAndValidity();
      return;
    }
    this.isSpinning = true;
    this.service.login(this.loginForm.value).subscribe((res): any => {
      console.log('Login response:', res);

      if(res.userId !== null){
        const user ={
          id: res.userId,
          role: res.userRole,
          name: res.userName
        };
        console.log('Saving user:', user);
        console.log('Saving JWT token:', res.jwt);
        StorageService.saveUser(user);
        StorageService.saveToken(res.jwt);
        if(StorageService.isAdminLoggedIn()){
          this.router.navigateByUrl("/admin/view-all");
        }
        else if(StorageService.isCustomerLoggedIn()){
          this.router.navigateByUrl("/user/view-all");
        }
      }
      else{
        this.isSpinning = false;
        return this.message.error("Bad credentials", {nzDuration: 5000});
      }
      this.isSpinning = false;
    }, (err) => {
      this.isSpinning = false;
      if (err && (err.status === 401 || err.status === 403)) {
        this.message.error("Email or password is incorrect", { nzDuration: 5000 });
      } else {
        this.message.error("Error at authentication. Try again.", { nzDuration: 5000 });
      }
    });
  }
}
