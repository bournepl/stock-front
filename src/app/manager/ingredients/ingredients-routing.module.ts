import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'ingredients-list', pathMatch: 'prefix' },
  { path: 'ingredients-list', loadChildren: () => import('./ingredients-list/ingredients-list.module').then(m => m.IngredientsListModule) },
  { path: 'ingredients-category', loadChildren: () => import('./ingredients-category/ingredients-category.module').then(m => m.IngredientsCategoryModule) },
  { path: 'print-barcode', loadChildren: () => import('./print-barcode/print-barcode.module').then(m => m.PrintBarcodeModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientsRoutingModule { }
