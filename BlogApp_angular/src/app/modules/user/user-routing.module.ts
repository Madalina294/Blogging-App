import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatePostComponent} from './user-components/create-post/create-post.component';
import {ViewAllComponent} from './user-components/view-all/view-all.component';
import {ViewPostComponent} from './user-components/view-post/view-post.component';
import {SearchComponent} from './user-components/search/search.component';

const routes : Routes = [
  {path: 'view-all', component: ViewAllComponent},
  {path: 'view-post/:id', component: ViewPostComponent},
  {path: 'search', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
