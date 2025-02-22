import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SupplierReportComponent } from './supplier-report/supplier-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'summary-report', pathMatch: 'prefix' },
  { path: 'summary-report', component: SummaryReportComponent },
  { path: 'inventory-report', component: InventoryReportComponent },
  { path: 'stock-report', component: StockReportComponent },
  { path: 'sales-report', component: SalesReportComponent },
  { path: 'supplier-report', component: SupplierReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
