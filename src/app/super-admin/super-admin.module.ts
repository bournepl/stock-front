import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { ComponentsModule } from './components/components.module';
import { SuperAdminComponent } from './super-admin.component';


@NgModule({
  declarations: [SuperAdminComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    SuperAdminRoutingModule
  ]
})
export class SuperAdminModule { }
