import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [
    BrandComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    BrandRoutingModule
  ]
})
export class BrandModule { }
