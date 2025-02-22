import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrService } from '../../../../../_services/pr.service';
import { StorageService } from '../../../../../_services/storage.service';
import { PrDetail } from '../../../../../_model/prDetail';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  focus: any;
  focus1: any;

  title = '';
  page = 1;
  pageSize = 10;
  count = 0;

  getAllPrDetail: PrDetail[] = [];

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private prService: PrService,
    private token: StorageService,

  ) { }

  ngOnInit() {

    this.retrievlPrDetail();

  }

  retrievlPrDetail() {
    this.loadingBar.show();
    const params = this.getRequestParams(this.title, this.page, this.pageSize);
    this.prService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params).subscribe(
      data => {
        const { result, totalItems } = data;

        this.getAllPrDetail = result;
        this.count = totalItems;

        this.loadingBar.hide();
      },
      error => {
        this.loadingBar.hide();
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          confirmButtonColor: '#07cdae',
          text: error.error.message,
        });

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
  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrievlPrDetail();

  }
  handlePageChange(event: number): void {
    this.page = event;

  }
  onAdd() {
    this.router.navigate(['/admin/store/purchases/pr/add']);
  }
  onDetail(id: string) {
    this.router.navigate(['/admin/store/purchases/pr/detail', id]);
  }
  onCancel(id: any) {

    Swal.fire({
      title: 'ยกเลิกรายการ?',
      text: "คุณต้องการยกเลิกรายการ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingBar.show();
        this.prService.cancel(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'ยกเลิกรายการสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.retrievlPrDetail();

              })
            }

          },
          error => {
            this.loadingBar.hide();
            Swal.fire({
              icon: "warning",
              title: 'Oops...',
              confirmButtonColor: '#07cdae',
              text: error.error.message,
            })

          });
      }
    })

  }


  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrievlPrDetail();
  }
}
