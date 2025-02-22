import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { PrintComponent } from './print/print.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'prefix' },
  { path: 'list', component: ListComponent },
  { path: 'print', component: PrintComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintBarcodeRoutingModule { }
