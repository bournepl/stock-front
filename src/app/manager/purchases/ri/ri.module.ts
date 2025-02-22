import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { PrintComponent } from './print/print.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatRadioModule } from '@angular/material/radio';
import { RiRoutingModule } from './ri-routing.module';


@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    DetailComponent,
    PrintComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatChipsModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    MatTooltipModule,
    ModalModule.forRoot(),
    RiRoutingModule
  ]
})
export class RiModule { }
