import { Routes } from '@angular/router';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import {HomeComponent} from './pages/home/home.component';
import {ViewAllComponent} from './pages/view-all/view-all.component';

export const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'home', component: HomeComponent},
  {path:'create-post', component:CreatePostComponent},
  {path:'view-all', component: ViewAllComponent}
];

