import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatePostComponent} from './user-components/create-post/create-post.component';
import {HomeComponent} from './user-components/home/home.component';
import {ViewAllComponent} from './user-components/view-all/view-all.component';
import {ViewPostComponent} from './user-components/view-post/view-post.component';

const routes : Routes = [
  {path: 'create-post', component: CreatePostComponent},
  {path: 'home', component: HomeComponent},
  {path: 'view-all', component: ViewAllComponent},
  {path: 'view-post/:id', component: ViewPostComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
