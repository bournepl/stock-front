import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { StorageService } from '../../../../_services/storage.service';
import { ReportSupplierService } from '../../../../_services/report-supplier.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Branch } from '../../../../_model/branch';
import { BranchService } from '../../../../_services/branch.service';

@Component({
  selector: 'app-supplier-report',
  templateUrl: './supplier-report.component.html',
  styleUrl: './supplier-report.component.scss'
})
export class SupplierReportComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  total: number = 0;

  getSupplier: any[] = [];

  fileNameExport = 'SupplierReport.xlsx';

  today: any;

  branchId = '';
  getBranch: Branch[] = [];
  constructor(
    private router: Router,
    private token: StorageService,
    private reportService: ReportSupplierService,
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

    const params = this.getRequestParams(this.title, this.branchId, this.date, this.page, this.pageSize);

    this.reportService.getAllBrand(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {

          const { result, totalItems, total } = data;

          this.getSupplier = result;
          this.count = totalItems;

          this.total = total;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
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

  onDateSelect(event: NgbDate) {
    this.date = ('0' + (event.day)).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;
    this.page = 1;
    this.retrieveReport();

  }

  onClear() {
    this.today = { day: '', month: '', year: '' };
    this.title = '';
    this.date = '';
    this.page = 1;
    this.branchId = '';
    this.retrieveReport();
  }
  searchBranch(event: any): void {
    this.branchId = event.target.value;
    this.page = 1;
    this.retrieveReport();
  }
}
