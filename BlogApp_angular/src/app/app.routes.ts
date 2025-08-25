import { Routes } from '@angular/router';
import { CreatePostComponent } from './modules/user/user-components/create-post/create-post.component';
import {HomeComponent} from './modules/user/user-components/home/home.component';
import {ViewAllComponent} from './modules/user/user-components/view-all/view-all.component';
import {LoginComponent} from './auth/auth-components/login/login.component';
import {SignupComponent} from './auth/auth-components/signup/signup.component';

export const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"signup", component: SignupComponent},
  {path:"admin", loadChildren:() =>
      import("./modules/admin/admin.module").then(e => e.AdminModule)},
  {path:"user", loadChildren:() =>
      import("./modules/user/user.module").then(e => e.UserModule)},
  {path:"**", redirectTo: "/user/home"}
];

