import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { PrintComponent } from './print/print.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'prefix' },
  { path: 'list', component: ListComponent },
  { path: 'add/:id', component: AddComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'print/:id', component: PrintComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiRoutingModule { }
