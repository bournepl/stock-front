import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SummaryService } from '../../../../../_services/summary.service';
import { StorageService } from '../../../../../_services/storage.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { BranchService } from '../../../../../_services/branch.service';
import { Branch } from '../../../../../_model/branch';
import { SummaryBrandService } from '../../../../../_services/summary-brand.service';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrl: './current.component.scss'
})
export class CurrentComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  latest_date: any;

  getIngredients: any[] = [];

  today: any;

  fileNameExport = 'CurrentStockSheet.xlsx';
  branchId = '';
  getBranch: Branch[] = [];
  constructor(
    private router: Router,
    private token: StorageService,
    private branchService: BranchService,
    private inventoryService: SummaryBrandService,
    private loadingBar: NgxSpinnerService,

  ) {

  }

  ngOnInit(): void {


    this.retrieveBranch();
    this.retrieveStock();
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

  retrieveStock() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.inventoryService.getAllCurrent(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
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


  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveStock();
  }


  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveStock();

  }
  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveStock();
  }
  searchBranch(event: any): void {
    this.branchId = event.target.value;
    this.page = 1;
    this.retrieveStock();
  }
  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }
}
