import { Component } from '@angular/core';
import { AddressService } from '../../../_services/address.service';
import { BrandDashboardService } from '../../../_services/brand-dashboard.service';
import { StorageService } from '../../../_services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Province } from '../../../_model/province';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrl: './summary-report.component.scss'
})
export class SummaryReportComponent {
  filter = '';
  getProvince: Province[];
  focus: any;
  focus1: any;
  getData: any[];

  fileNameExport = 'SummaryReport.xlsx';

  constructor(
    private addressService: AddressService,
    private brandDashboardService: BrandDashboardService,
    private token: StorageService,
    private loadingBar: NgxSpinnerService,
  ) { }
  ngOnInit(): void {


    this.addressService.getProvince().subscribe(data => {
      this.getProvince = data;
    });

    this.getAll();
  }


  onChangeProvince(event: any) {


    if (event.target.value == -1) {
      this.getAll();
    } else {
      this.getByProvince(event.target.value);
    }

  }

  getAll() {
    this.loadingBar.show();
    this.brandDashboardService.getAll().subscribe(
      {
        next: (res) => {
          console.log(res.result)
          if (res.result == undefined) {
            this.loadingBar.hide();
            return;
          }

          this.getData = res.result;
          this.getData.sort((a, b) => b.value - a.value);
          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      }
    )
  }

  getByProvince(id: string) {
    this.loadingBar.show();
    this.brandDashboardService.getByProvince(id).subscribe({
      next: (res) => {

        if (!res.result) {
          this.getData = [];
          this.loadingBar.hide();
          return;
        }
        this.getData = res.result;
        this.getData.sort((a, b) => b.value - a.value);

        this.loadingBar.hide();
      },
      error: (err) => {
        console.log(err);

      }
    }
    )
  }

  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }
}
