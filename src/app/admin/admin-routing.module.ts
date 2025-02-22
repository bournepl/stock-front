import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'brand', pathMatch: 'prefix' },
  { path: 'brand', loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule) },
  { path: 'store', loadChildren: () => import('./store/store.module').then(m => m.StoreModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
