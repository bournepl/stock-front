import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { InventoryService } from '../../../_services/inventory.service';
import { StorageService } from '../../../_services/storage.service';
import { Router } from '@angular/router';
import { Ingredients } from '../../../_model/ingredients';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrl: './current-stock.component.scss'
})
export class CurrentStockComponent {
  focus: any;
  focus1: any;

  title = '';

  page = 1;
  pageSize = 10;
  count = 0;



  getIngredients: Ingredients[] = [];





  constructor(
    private router: Router,
    private token: StorageService,
    private inventoryService: InventoryService,
    private loadingBar: NgxSpinnerService,

  ) {

  }

  ngOnInit(): void {


    this.retrieveCurrentStock();

  }

  retrieveCurrentStock() {

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
    this.retrieveCurrentStock();
  }



  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveCurrentStock();

  }
}
