import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatePostComponent} from './user-components/create-post/create-post.component';
import {HomeComponent} from './user-components/home/home.component';
import {ViewAllComponent} from './user-components/view-all/view-all.component';

const routes : Routes = [
  {path: 'create-post', component: CreatePostComponent},
  {path: 'home', component: HomeComponent},
  {path: 'view-all', component: ViewAllComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
