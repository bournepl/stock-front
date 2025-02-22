import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintBarcodeRoutingModule } from './print-barcode-routing.module';

import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PrintComponent } from './print/print.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    PrintComponent,
    ListComponent,

  ],
  imports: [
    CommonModule,
    NgxBarcode6Module,
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
    PrintBarcodeRoutingModule
  ]
})
export class PrintBarcodeModule { }
