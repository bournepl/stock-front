import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'prefix' },
  { path: 'brand', component: ListComponent },
  { path: 'brand/detail/:id', component: DetailComponent },
  { path: 'user', component: UserComponent },
  { path: 'user/edit/:id', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
