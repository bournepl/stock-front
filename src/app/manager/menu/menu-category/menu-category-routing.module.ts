import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCategoryComponent } from './menu-category.component';

const routes: Routes = [
  { path: '', component: MenuCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuCategoryRoutingModule { }
