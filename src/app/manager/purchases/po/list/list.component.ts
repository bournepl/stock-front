import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { PoDetail } from '../../../../_model/poDetail';
import { PoService } from '../../../../_services/po.service';
import { StorageService } from '../../../../_services/storage.service';
import { PrService } from '../../../../_services/pr.service';


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

  getAllPoDetail: PoDetail[] = [];

  constructor(
    private router: Router,
    private prService: PrService,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private poService: PoService,
    private token: StorageService,

  ) { }

  ngOnInit() {

    this.retrievlPoDetail();

  }

  retrievlPoDetail() {
    this.loadingBar.show();
    const params = this.getRequestParams(this.title, this.page, this.pageSize);
    this.poService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params).subscribe(
      data => {
        const { result, totalItems } = data;

        this.getAllPoDetail = result;
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
    this.retrievlPoDetail();

  }
  handlePageChange(event: number): void {
    this.page = event;

  }
  onAdd() {
    this.router.navigate(['/manager/purchases/po/add']);
  }
  onDetail(id: string) {
    this.router.navigate(['/manager/purchases/po/detail', id]);
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
        this.poService.cancel(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'ยกเลิกรายการสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.retrievlPoDetail();

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

  onRouter(value: string) {

    this.prService.findPrByPrId(this.token.getUser().uniqueKey, value).subscribe({
      next: (data) => {
        this.router.navigate(['/manager/purchases/pr/detail', data.id]);
      },
    });

  }
}
