import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'pr', pathMatch: 'prefix' },


  { path: 'pr', loadChildren: () => import('./pr/pr.module').then(m => m.PrModule) },
  { path: 'po', loadChildren: () => import('./po/po.module').then(m => m.PoModule) },
  { path: 'ri', loadChildren: () => import('./ri/ri.module').then(m => m.RiModule) },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
