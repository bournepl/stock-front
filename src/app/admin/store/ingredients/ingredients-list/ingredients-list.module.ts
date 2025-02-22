import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientsListRoutingModule } from './ingredients-list-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatRadioModule } from '@angular/material/radio';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    DetailComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgxBarcode6Module,
    MatChipsModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    MatTooltipModule,
    ModalModule.forRoot(),
    MatRadioModule,
    IngredientsListRoutingModule
  ]
})
export class IngredientsListModule { }
