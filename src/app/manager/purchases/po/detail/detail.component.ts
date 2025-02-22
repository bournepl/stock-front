import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Ingredients } from '../../../../_model/ingredients';
import { PoDetail } from '../../../../_model/poDetail';
import { PoService } from '../../../../_services/po.service';
import { Supplier } from '../../../../_model/supplier';
import { User } from '../../../../_model/user';
import { StorageService } from '../../../../_services/storage.service';
import { PrService } from '../../../../_services/pr.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  cartItemList: Ingredients[] = [];
  title = '';
  page = 1;
  pageSize = 10;
  count = 0;
  getOrderDetail: PoDetail;

  imageToShow: any = 'assets/img/noimage.png';

  description: string = '';
  shipping: number = 0;
  total: number = 0;
  totalVat: number = 0;
  totalAll: number = 0;
  vat: number = 0;
  totalShipping: number = 0;
  totalQuantity: number = 0;

  discountValue: number = 0;
  totalDiscount: number = 0;

  selectedVat = 'ไม่มีภาษี';

  getSupplier: Supplier;

  discount: number = 0;
  totalItem: number = 0;

  imgSrc: string;

  getUser: User;

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private poService: PoService,
    private token: StorageService,
    private prService: PrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.retrievlPoDetail();
  }

  retrievlPoDetail() {
    this.loadingBar.show();

    this.route.params.subscribe((params) => {
      this.poService.findById(params['id']).subscribe(
        (data) => {
          this.getOrderDetail = data;

          this.cartItemList = this.getOrderDetail.items;

          this.totalItem = this.getOrderDetail.items.length;

          this.getSupplier = this.getOrderDetail.supplier;


          this.getUser = this.getOrderDetail.user;

          this.shipping = this.getOrderDetail.shipping;
          this.discountValue = this.getOrderDetail.discount;
          this.discount = this.getOrderDetail.discount;
          this.selectedVat = this.getOrderDetail.vatType;


          this.loadCart();
          this.loadingBar.hide();
        },
        (error) => {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            confirmButtonColor: '#07cdae',
            text: error.error.message,
          });
        }
      );
    });
  }

  loadCart() {

    this.totalQuantity = this.cartItemList.map((data) => +data.quantityRequest).reduce((acc, value) => acc + value, 0);
    this.totalItem = this.cartItemList.length;

    let totalNum: number = 0;

    this.cartItemList.map(item => {
      totalNum += (item.price * item.quantityRequest);
    });

    this.total = totalNum;
    this.totalShipping = this.total + this.shipping;
    this.totalDiscount = this.totalShipping - this.discountValue;

    if (this.selectedVat == 'ไม่มีภาษี') {
      this.vat = 0;
      this.totalVat = this.totalDiscount + this.vat;
      this.totalAll = this.totalVat;
    } else if (this.selectedVat == 'รวมภาษีมูลค่าเพิ่ม') {
      this.vat = this.totalDiscount * (7 / 107);
      this.totalVat = this.totalDiscount * (100 / 107);
      this.totalAll = this.totalDiscount;
    } else {
      this.vat = this.totalDiscount * 0.07;
      this.totalVat = this.totalDiscount;
      this.totalAll = this.totalVat + this.vat;
    }

  }
  onPrint(id: string) {
    this.router.navigate(['/manager/purchases/po/print', id]);
  }

  onApporved(id: any) {
    Swal.fire({
      title: 'อนุมัติรายการ?',
      text: "คุณต้องการอนุมัติรายการ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'

    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingBar.show();
        this.poService.approved(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'อนุมัติรายการสำเร็จ',
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

  onUnApporved(id: any) {
    Swal.fire({
      title: 'อนุมัติรายการ?',
      text: "คุณต้องการอนุมัติรายการ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingBar.show();


        this.poService.unapproved(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'รายการสำเร็จแล้ว',
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
        this.poService.cancel(this.token.getUser().admin, id).subscribe(
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

  onCreateRi(id: any) {


    this.router.navigate(['/manager/purchases/ri/add', id]);

  }

  onRouter(value: string) {

    this.prService.findPrByPrId(this.token.getUser().admin, value).subscribe({
      next: (data) => {
        this.router.navigate(['/manager/purchases/pr/detail', data.id]);
      },
    });

  }
}

