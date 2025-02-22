import { Component, inject } from '@angular/core';
import { Menu } from '../../../../_model/menu';
import { MenuCategory } from '../../../../_model/menu-category';
import { Router } from '@angular/router';
import { MenuCategoryService } from '../../../../_services/menu-category.service';
import { StorageService } from '../../../../_services/storage.service';
import { MenuService } from '../../../../_services/menu.service';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../../../../_services/excel.service';
import * as XLSX from 'xlsx';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../../../../_services/report.service';
import { Branch } from '../../../../_model/branch';
import { BranchService } from '../../../../_services/branch.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss'
})
export class SalesReportComponent {

  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;
  getMenu: any[] = [];
  menu: Menu;

  getCategory: MenuCategory[] = [];

  today = inject(NgbCalendar).getToday();


  fileNameExport = 'SalesReport.xlsx';
  branchId = '';
  getBranch: Branch[] = [];
  constructor(
    private router: Router,
    private categoryService: MenuCategoryService,
    private token: StorageService,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private branchService: BranchService,
    private excelService: ExcelService

  ) {

  }

  ngOnInit(): void {

    this.date = ('0' + (this.today.day)).slice(-2) + '/' + ('0' + (this.today.month)).slice(-2) + '/' + this.today.year;

    this.retrieveCategory();
    this.retrieveMenu();
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
  retrieveCategory() {

    this.loadingBar.show();
    this.categoryService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId(),)
      .subscribe({
        next: (data) => {
          this.getCategory = data;

        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  retrieveMenu() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.branchId, this.date, this.page, this.pageSize);

    this.reportService.getAllSalesBrand(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;
          this.getMenu = result;
          this.count = totalItems;

          console.log(data)

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }


  onDateSelect(event: NgbDate) {

    this.date = ('0' + (event.day)).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;

    this.page = 1;
    this.retrieveMenu();

  }

  getRequestParams(searchTitle: string, branchId: string, date: string, page: number, pageSize: number): any {
    let params: any = {};
    if (branchId) {
      params['branchId'] = branchId;
    }
    if (searchTitle) {
      params['title'] = searchTitle;
    }

    if (date) {
      params['date'] = date;
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
    this.retrieveMenu();
  }


  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveMenu();
  }
  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveMenu();

  }
  searchBranch(event: any): void {
    this.branchId = event.target.value;
    this.page = 1;
    this.retrieveMenu();
  }
  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }

}
