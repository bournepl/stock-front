import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuplicateComponent } from './duplicate.component';

const routes: Routes = [
  {
    path: '', component: DuplicateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuplicateRoutingModule { }
