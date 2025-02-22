import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [
    StaffComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    StaffRoutingModule
  ]
})
export class StaffModule { }
