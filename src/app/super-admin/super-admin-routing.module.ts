import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';

const routes: Routes = [
  {
    path: '', component: SuperAdminComponent,
    children: [
      { path: '', redirectTo: 'report', pathMatch: 'prefix' },
      { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'brand', loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule) },
      { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
