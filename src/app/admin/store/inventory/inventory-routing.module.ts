import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BomStockComponent } from './bom-stock/bom-stock.component';
import { UseStockComponent } from './use-stock/use-stock.component';
import { WasteStockComponent } from './waste-stock/waste-stock.component';
import { PurchaseStockComponent } from './purchase-stock/purchase-stock.component';
import { CurrentStockComponent } from './current-stock/current-stock.component';
import { LastStockComponent } from './last-stock/last-stock.component';
import { CalculateComponent } from './calculate/calculate.component';

const routes: Routes = [
  { path: '', redirectTo: 'current-stock', pathMatch: 'prefix' },
  { path: 'current-stock', component: CurrentStockComponent },
  { path: 'purchase-stock', component: PurchaseStockComponent },
  { path: 'waste-stock', component: WasteStockComponent },
  { path: 'use-stock', component: UseStockComponent },
  { path: 'last-stock', component: LastStockComponent },
  { path: 'bom-stock', component: BomStockComponent },
  { path: 'calculate', component: CalculateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
