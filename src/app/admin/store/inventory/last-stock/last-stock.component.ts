import { Component, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InventoryService } from '../../../../_services/inventory.service';
import { StorageService } from '../../../../_services/storage.service';
import { Router } from '@angular/router';
import { Ingredients } from '../../../../_model/ingredients';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-last-stock',
  templateUrl: './last-stock.component.html',
  styleUrl: './last-stock.component.scss'
})
export class LastStockComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  latest_date: any;

  getIngredients: Ingredients[] = [];

  model: NgbDateStruct;

  today = inject(NgbCalendar).getToday();

  todayDate = '';

  fileNameExport = 'LastStockSheet.xlsx';


  constructor(
    private router: Router,
    private token: StorageService,
    private inventoryService: InventoryService,
    private loadingBar: NgxSpinnerService,

  ) {

  }

  ngOnInit(): void {

    this.date = ('0' + (this.today.day - 1)).slice(-2) + '/' + ('0' + (this.today.month)).slice(-2) + '/' + this.today.year;

    this.todayDate = ('0' + (this.today.day)).slice(-2) + '/' + ('0' + (this.today.month)).slice(-2) + '/' + this.today.year;

    this.retrieveStock();

  }

  retrieveStock() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.date, this.page, this.pageSize);

    this.inventoryService.getAllLast(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
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
    this.retrieveStock();
  }

  onDateSelect(event: NgbDate) {

    this.date = ('0' + (event.day - 1)).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;
    this.todayDate = ('0' + (event.day)).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;
    this.page = 1;
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

  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }
}

