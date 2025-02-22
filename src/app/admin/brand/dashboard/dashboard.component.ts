import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../_services/storage.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../../_services/dashboard.service';
import { DashboardBrandService } from '../../../_services/dashboard-brand.service';
import { BranchService } from '../../../_services/branch.service';
import { Branch } from '../../../_model/branch';
import { SummaryBrandService } from '../../../_services/summary-brand.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  focus: any;
  focus1: any;

  totalP: number = 0;
  totalW: number = 0;
  total: number = 0;
  totalIn: number = 0;

  branchId = '';
  getBranch: Branch[] = [];

  sum: number = 0;

  getIngredients: any[] = [];


  title = '';
  date = '';
  page = 1;
  pageSize = 1000;
  count = 0;


  constructor(
    private router: Router,
    private token: StorageService,
    private branchService: BranchService,
    private dashboardService: DashboardBrandService,
    private loadingBar: NgxSpinnerService,
    private inventoryService: SummaryBrandService,
  ) { }

  ngOnInit() {

    this.retrieveStock();
    this.retrieveBranch();
    this.retrieveBom();
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
    const params = this.getRequestParams(this.branchId);
    this.dashboardService.findAll(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {

          const { totalP, totalW, total, totalIn } = data;

          this.totalIn = totalIn;
          this.totalP = totalP;
          this.totalW = totalW;
          this.total = total;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  getRequestParams(branchId: string): any {
    let params: any = {};
    if (branchId) {
      params['branchId'] = branchId;
    }
    return params;
  }




  searchBranch(event: any): void {
    this.branchId = event.target.value;

    this.router.navigate(
      ['/admin/brand/dashboard'],
      { queryParams: { branchId: this.branchId } }
    );

    this.retrieveStock();
  }
  onClear() {
    this.router.navigate(
      ['/admin/brand/dashboard'],

    );
    this.branchId = '';

    this.retrieveStock();
  }

  retrieveBom() {

    this.loadingBar.show();

    const params = this.getRequestParams2(this.title, this.date, this.page, this.pageSize);
    this.inventoryService.getAllBom(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;

          this.getIngredients = result;


          this.sum = this.getIngredients.reduce((acc: any, cur: any) => acc + cur.bomQuantity, 0);

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  getRequestParams2(searchTitle: string, date: string, page: number, pageSize: number): any {
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

}
