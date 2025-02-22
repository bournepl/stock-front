import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../_services/storage.service';
import { DashboardService } from '../../../../_services/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as Chartist from 'chartist';


@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrl: './chart3.component.scss'
})
export class Chart3Component {
  number: number[];
  numberMax: number;

  public canvas: any;
  public ctx: any;



  public lineChartType: any;
  public lineChartData: Array<any>;
  public lineChartOptions: any;
  public lineChartLabels: Array<any>;
  public lineChartColors: Array<any>

  public gradientChartOptionsConfiguration: any;

  constructor(
    private router: Router,
    private token: StorageService,
    private dashboardService: DashboardService,
    private loadingBar: NgxSpinnerService,
  ) { }

  ngOnInit() {

    this.wasteMonth();

    this.canvas = document.getElementById("lineChartExample");
    this.ctx = this.canvas.getContext("2d");


    this.lineChartOptions = this.gradientChartOptionsConfiguration;

    this.lineChartType = 'line';

    this.gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };


    this.lineChartColors = [
      {
        borderColor: "#f96332",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#f96332",

      }
    ];

  }

  wasteMonth() {

    this.loadingBar.show();

    this.dashboardService.findAllChart3(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {

          this.lineChartData = [
            {
              label: "Total",
              pointBorderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 1,
              pointRadius: 4,
              fill: true,
              borderWidth: 2,
              data: data.dataValue,

            }
          ];

          this.lineChartLabels = data.dataDate;


        },
        error: (err) => {
          console.log(err);

        }
      });
  }

}

