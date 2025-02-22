import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../../../../_services/storage.service';
import { SummaryService } from '../../../../../_services/summary.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { BranchService } from '../../../../../_services/branch.service';
import { Branch } from '../../../../../_model/branch';
import { SummaryBrandService } from '../../../../../_services/summary-brand.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  latest_date: any;

  getIngredients: any[] = [];

  model: NgbDateStruct;

  today: any;

  fileNameExport = 'PurchaseStockSheet.xlsx';
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
    this.retrievePurchaseStock();
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

  retrievePurchaseStock() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.date, this.page, this.pageSize);

    this.inventoryService.getAllPurchase(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
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

  getRequestParams(searchTitle: string, date: string, page: number, pageSize: number): any {
    let params: any = {};

    if (date) {
      params['date'] = date;
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
    this.retrievePurchaseStock();
  }

  onDateSelect(event: NgbDate) {

    this.date = ('0' + event.day).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;
    this.page = 1;
    this.retrievePurchaseStock();

  }

  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrievePurchaseStock();

  }
  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrievePurchaseStock();
  }
  onClear() {
    this.today = { day: '', month: '', year: '' };
    this.title = '';
    this.date = '';
    this.branchId = '';
    this.page = 1;
    this.retrievePurchaseStock();
  }
  searchBranch(event: any): void {
    this.branchId = event.target.value;
    this.page = 1;
    this.retrievePurchaseStock();
  }
  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }
}
