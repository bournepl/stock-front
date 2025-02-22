import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatRadioModule } from '@angular/material/radio';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SupplierReportComponent } from './supplier-report/supplier-report.component';
import { WasteComponent } from './summary-report/waste/waste.component';

import { PurchaseComponent } from './summary-report/purchase/purchase.component';
import { BomComponent } from './summary-report/bom/bom.component';
import { UseComponent } from './summary-report/use/use.component';
import { CurrentComponent } from './summary-report/current/current.component';
import { MovementComponent } from './stock-report/movement/movement.component';
import { MinStockComponent } from './stock-report/min-stock/min-stock.component';

@NgModule({
  declarations: [
    InventoryReportComponent,
    StockReportComponent,
    SummaryReportComponent,
    SalesReportComponent,
    SupplierReportComponent,
    WasteComponent,

    PurchaseComponent,
    BomComponent,
    UseComponent,
    CurrentComponent,
    MovementComponent,
    MinStockComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatChipsModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    MatTooltipModule,
    ModalModule.forRoot(),
    MatRadioModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
