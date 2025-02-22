import { Component } from '@angular/core';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrl: './summary-report.component.scss'
})
export class SummaryReportComponent {
  focus: any;
  focus1: any;
  page = 1;

  handlePageChange(event: number): void {
    this.page = event;

  }
}
