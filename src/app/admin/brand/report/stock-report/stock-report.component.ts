import { Component } from '@angular/core';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrl: './stock-report.component.scss'
})
export class StockReportComponent {
  focus: any;
  focus1: any;
  page = 1;

  handlePageChange(event: number): void {
    this.page = event;

  }
}
