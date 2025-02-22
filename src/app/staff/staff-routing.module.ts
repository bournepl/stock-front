import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffComponent } from './staff.component';

const routes: Routes = [
  {
    path: '', component: StaffComponent,
    children: [
      { path: '', redirectTo: 'check-stock', pathMatch: 'prefix' },
      { path: 'check-stock', loadChildren: () => import('./check-stock/check-stock.module').then(m => m.CheckStockModule) },
      { path: 'receipt', loadChildren: () => import('./receipt/receipt.module').then(m => m.ReceiptModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
