import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientsCategoryComponent } from './ingredients-category.component';

const routes: Routes = [
  { path: '', component: IngredientsCategoryComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientsCategoryRoutingModule { }
