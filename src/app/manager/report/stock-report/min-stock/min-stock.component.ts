import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../../../_services/storage.service';
import { ReportStockService } from '../../../../_services/report-stock.service';



@Component({
  selector: 'app-min-stock',
  templateUrl: './min-stock.component.html',
  styleUrl: './min-stock.component.scss'
})
export class MinStockComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  total: number = 0;

  getSupplier: any[] = [];

  fileNameExport = 'MinStockReport.xlsx';

  today: any;

  getIngredients: any[] = [];

  constructor(
    private router: Router,
    private token: StorageService,
    private reportService: ReportStockService,
    private loadingBar: NgxSpinnerService,

  ) {

  }

  ngOnInit(): void {


    this.retrieveReport();

  }



  retrieveReport() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.reportService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;

          this.getIngredients = result;
          this.getIngredients = this.getIngredients.filter(data => data.quantity < data.minStock);
          this.count = totalItems;



          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};


    if (searchTitle) {
      params['title'] = searchTitle;
    }


    if (page) {
      params['page'] = page - 1;
    }

    if (pageSize) {
      params['size'] = pageSize;
    }

    return params;
  }


  handlePageChange2(event: number): void {
    this.page = event;
    this.retrieveReport();
  }



  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveReport();

  }

  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveReport();
  }

  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }


}

