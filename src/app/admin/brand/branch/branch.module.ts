import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    BranchComponent
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
    BranchRoutingModule
  ]
})
export class BranchModule { }
