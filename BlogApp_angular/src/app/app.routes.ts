import { Routes } from '@angular/router';
import {LoginComponent} from './auth/auth-components/login/login.component';
import {SignupComponent} from './auth/auth-components/signup/signup.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {path:"", redirectTo: "login", pathMatch: "full"},
  {path:"login", component:LoginComponent, canActivate: [AuthGuard]},
  {path:"signup", component: SignupComponent, canActivate: [AuthGuard]},
  {path:"admin", loadChildren:() =>
      import("./modules/admin/admin.module").then(e => e.AdminModule)},
  {path:"user", loadChildren:() =>
      import("./modules/user/user.module").then(e => e.UserModule)},
  {path:"**", redirectTo: "login"}
];

