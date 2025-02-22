import { Component, inject } from '@angular/core';
import { Ingredients } from '../../../../_model/ingredients';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StorageService } from '../../../../_services/storage.service';
import { InventoryService } from '../../../../_services/inventory.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-waste-stock',
  templateUrl: './waste-stock.component.html',
  styleUrl: './waste-stock.component.scss'
})
export class WasteStockComponent {
  focus: any;
  focus1: any;

  title = '';
  status = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  latest_date: any;

  getIngredients: any[] = [];

  model: NgbDateStruct;

  today = inject(NgbCalendar).getToday();

  sum: number = 0;

  fileNameExport = 'WasteStockSheet.xlsx';

  constructor(
    private router: Router,
    private token: StorageService,
    private inventoryService: InventoryService,
    private loadingBar: NgxSpinnerService,

  ) {

  }

  ngOnInit(): void {

    this.date = ('0' + (this.today.day)).slice(-2) + '/' + ('0' + (this.today.month)).slice(-2) + '/' + this.today.year;


    this.retrieveStock();

  }

  retrieveStock() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.date, this.status, this.page, this.pageSize);

    this.inventoryService.getAllWaste(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems, sumWaste } = data;

          this.getIngredients = result;
          this.sum = sumWaste;
          // console.log(this.sum)

          this.count = totalItems;


          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  getRequestParams(searchTitle: string, date: string, status: string, page: number, pageSize: number): any {
    let params: any = {};

    if (date) {
      params['date'] = date;
    }
    if (status) {
      params['status'] = status;
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

    this.date = ('0' + (event.day)).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;

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

  onChangeStatus(event: any) {
    this.status = event.target.value;
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

