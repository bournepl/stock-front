import { Component } from '@angular/core';
import { Ingredients } from '../../../../_model/ingredients';
import { Router } from '@angular/router';
import { StorageService } from '../../../../_services/storage.service';
import { ReportService } from '../../../../_services/report.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { Branch } from '../../../../_model/branch';
import { BranchService } from '../../../../_services/branch.service';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss'
})
export class InventoryReportComponent {
  focus: any;
  focus1: any;

  title = '';

  page = 1;
  pageSize = 10;
  count = 0;

  total: number = 0;

  getIngredients: any[] = [];


  fileNameExport = 'InventoryReport.xlsx';

  branchId = '';
  getBranch: Branch[] = [];
  constructor(
    private router: Router,
    private token: StorageService,
    private reportService: ReportService,
    private loadingBar: NgxSpinnerService,
    private branchService: BranchService,
  ) {

  }

  ngOnInit(): void {


    this.retrieveCurrentStock();
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
  retrieveCurrentStock() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.branchId, this.page, this.pageSize);

    this.reportService.getAllCurrentBrand(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {

          const { result, totalItems, total } = data;

          this.getIngredients = result;
          this.count = totalItems;

          this.total = total;

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
    this.retrieveCurrentStock();
  }



  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveCurrentStock();

  }

  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveCurrentStock();
  }
  searchBranch(event: any): void {
    this.branchId = event.target.value;
    this.page = 1;
    this.retrieveCurrentStock();
  }
  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }
}
