import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import { DashboardService } from '../../_services/dashboard.service';
import { StorageService } from '../../_services/storage.service';
import { SummaryService } from '../../_services/summary.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalP: number = 0;
  totalW: number = 0;
  total: number = 0;
  totalIn: number = 0;

  title = '';
  date = '';
  page = 1;
  pageSize = 100;
  count = 0;

  sum: number = 0;

  getIngredients: any[] = [];

  constructor(
    private router: Router,
    private token: StorageService,
    private dashboardService: DashboardService,
    private loadingBar: NgxSpinnerService,
    private inventoryService: SummaryService,
  ) { }

  ngOnInit() {

    this.retrieveStock();
    this.retrieveStockBom();

  }

  retrieveStock() {

    this.loadingBar.show();

    this.dashboardService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId())
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

  retrieveStockBom() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.date, this.page, this.pageSize);

    this.inventoryService.getAllBom(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;

          this.getIngredients = result;

          this.sum = this.getIngredients.reduce((acc: any, cur: any) => acc + cur.bomQuantity, 0);

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
}
