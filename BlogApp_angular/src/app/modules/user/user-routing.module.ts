import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatePostComponent} from './user-components/create-post/create-post.component';
import {ViewAllComponent} from './user-components/view-all/view-all.component';
import {ViewPostComponent} from './user-components/view-post/view-post.component';
import {SearchComponent} from './user-components/search/search.component';
import {MyAccountComponent} from './user-components/my-account/my-account.component';

const routes : Routes = [
  {path: 'view-all', component: ViewAllComponent},
  {path: 'create-post', component: CreatePostComponent},
  {path: 'view-post/:id', component: ViewPostComponent},
  {path: 'search', component: SearchComponent},
  {path: 'my-account', component: MyAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
