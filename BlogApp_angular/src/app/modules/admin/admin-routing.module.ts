import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewAllComponent} from './admin-components/view-all/view-all.component';
import {ViewPostComponent} from './admin-components/view-post/view-post.component';
import {SearchComponent} from './admin-components/search/search.component';

const routes: Routes = [
  {path:"view-all", component: ViewAllComponent},
  {path: 'view-post/:id', component: ViewPostComponent},
  {path: 'search', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
