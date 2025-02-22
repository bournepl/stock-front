import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckStockComponent } from './check-stock.component';

const routes: Routes = [
  { path: '', component: CheckStockComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckStockRoutingModule { }
