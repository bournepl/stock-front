import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [
    ManagerComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
