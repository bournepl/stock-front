import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'prefix' },
  { path: 'user', component: UserProfileComponent },
  { path: 'company', component: CompanyComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
