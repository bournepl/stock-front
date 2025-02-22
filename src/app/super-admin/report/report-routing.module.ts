import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { UserReportComponent } from './user-report/user-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'summary-report', pathMatch: 'prefix' },
  { path: 'summary-report', component: SummaryReportComponent },
  { path: 'user-report', component: UserReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
