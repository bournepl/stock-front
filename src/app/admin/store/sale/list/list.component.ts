import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from '../../../../_services/order.service';
import { StorageService } from '../../../../_services/storage.service';
import { OrderDetail } from '../../../../_model/orderDetail';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  getOrder: OrderDetail[] = [];

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private token: StorageService,
  ) { }

  handlePageChange(event: number): void {
    this.page = event;

  }
  onAdd() {
    this.router.navigate(['/admin/store/sale/add']);
  }
  onInformation(id: string) {
    this.router.navigate(['/admin/store/sale/detail', id]);
  }
  onEdit() {
    this.router.navigate(['/admin/store/sale/edit', 1]);
  }

  ngOnInit() {
    this.retrieveOrder();
  }

  retrieveOrder() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.date, this.page, this.pageSize);

    this.orderService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;

          this.getOrder = result;
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
