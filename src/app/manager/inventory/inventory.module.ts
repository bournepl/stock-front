import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { BomStockComponent } from './bom-stock/bom-stock.component';
import { PurchaseStockComponent } from './purchase-stock/purchase-stock.component';
import { WasteStockComponent } from './waste-stock/waste-stock.component';
import { UseStockComponent } from './use-stock/use-stock.component';
import { CurrentStockComponent } from './current-stock/current-stock.component';
import { LastStockComponent } from './last-stock/last-stock.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatRadioModule } from '@angular/material/radio';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BomStockComponent,
    PurchaseStockComponent,
    WasteStockComponent,
    UseStockComponent,
    CurrentStockComponent,
    LastStockComponent
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
    InventoryRoutingModule
  ]
})
export class InventoryModule { }
