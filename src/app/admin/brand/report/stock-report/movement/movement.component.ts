import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ReportStockService } from '../../../../../_services/report-stock.service';
import { StorageService } from '../../../../../_services/storage.service';
import { BranchService } from '../../../../../_services/branch.service';
import { Branch } from '../../../../../_model/branch';


@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.scss'
})
export class MovementComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  total: number = 0;

  getSupplier: any[] = [];

  fileNameExport = 'MovementReport.xlsx';

  today: any;

  getIngredients: any[] = [];
  branchId = '';
  getBranch: Branch[] = [];
  constructor(
    private router: Router,
    private token: StorageService,
    private reportService: ReportStockService,
    private loadingBar: NgxSpinnerService,
    private branchService: BranchService,
  ) {

  }

  ngOnInit(): void {


    this.retrieveReport();
    this.retrieveBranch();
  }
  retrieveBranch(): void {

    this.branchService.findAll(this.token.getUser().uniqueKey)
      .subscribe({
        next: (data) => {

          this.getBranch = data;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }


  retrieveReport() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.branchId, this.page, this.pageSize);

    this.reportService.getAllBrand(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;

          this.getIngredients = result;
          this.count = totalItems;



          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  getRequestParams(searchTitle: string, branchId: string, page: number, pageSize: number): any {
    let params: any = {};
    if (branchId) {
      params['branchId'] = branchId;
    }


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


  handlePageChange(event: number): void {
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
  searchBranch(event: any): void {
    this.branchId = event.target.value;
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
