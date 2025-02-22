import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'menu-list', pathMatch: 'prefix' },
  { path: 'menu-list', loadChildren: () => import('./menu-list/menu-list.module').then(m => m.MenuListModule) },
  { path: 'menu-category', loadChildren: () => import('./menu-category/menu-category.module').then(m => m.MenuCategoryModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
