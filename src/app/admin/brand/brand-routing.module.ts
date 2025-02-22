import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './brand.component';

const routes: Routes = [
  {
    path: '', component: BrandComponent,
    children: [
      { path: '', redirectTo: 'branch', pathMatch: 'prefix' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'branch', loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
      { path: 'duplicate', loadChildren: () => import('./duplicate/duplicate.module').then(m => m.DuplicateModule) },
      { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
