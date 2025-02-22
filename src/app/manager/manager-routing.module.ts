import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './manager.component';

const routes: Routes = [
  {
    path: '', component: ManagerComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'supplier', loadChildren: () => import('./suppiler/suppiler.module').then(m => m.SuppilerModule) },
      { path: 'ingredients', loadChildren: () => import('./ingredients/ingredients.module').then(m => m.IngredientsModule) },
      { path: 'purchases', loadChildren: () => import('./purchases/purchases.module').then(m => m.PurchasesModule) },
      { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
      { path: 'sale', loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule) },
      { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
      { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule) },
      { path: 'check-stock', loadChildren: () => import('./check-stock/check-stock.module').then(m => m.CheckStockModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
