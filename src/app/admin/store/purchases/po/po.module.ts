import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoRoutingModule } from './po-routing.module';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { PrintComponent } from './print/print.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ListComponent } from './list/list.component';
import { MatChipsModule } from '@angular/material/chips';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    DetailComponent,
    PrintComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatChipsModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    MatTooltipModule,
    ModalModule.forRoot(),
    PoRoutingModule
  ]
})
export class PoModule { }
