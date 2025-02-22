import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Ingredients } from '../../../../../_model/ingredients';
import { PrDetail } from '../../../../../_model/prDetail';
import { PrService } from '../../../../../_services/pr.service';
import { User } from '../../../../../_model/user';
import { StorageService } from '../../../../../_services/storage.service';
import { CartPoService } from '../../../../../_services/cart-po.service';
import { PoService } from '../../../../../_services/po.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {


  filter3 = '';
  filter2 = '';
  page2 = 1;
  pageSize2 = 5;
  count2 = 0;


  imageToShow: any = 'assets/img/noimage.png';

  cartItemList: Ingredients[] = [];
  getOrderDetail: PrDetail;

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
  totalItem: number = 0;

  selectedVat = 'ไม่มีภาษี';

  discount: number = 0;
  getUser: User;

  imgSrc: string;


  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private prService: PrService,
    private token: StorageService,
    private route: ActivatedRoute,
    private cartPoService: CartPoService,
    private poService: PoService
  ) { }

  ngOnInit(): void {

    this.retrievlPrDetail();
  }

  retrievlPrDetail() {
    this.loadingBar.show();

    this.route.params.subscribe((params) => {
      this.prService.findById(params['id']).subscribe(
        (data) => {
          this.getOrderDetail = data;
          console.log(data)

          this.cartItemList = this.getOrderDetail.items;
          this.totalItem = this.getOrderDetail.items.length;
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
      totalNum += (item.price * item.quantity);
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
    this.router.navigate(['/admin/store/purchases/pr/print', id]);
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

  onApporved(id: any) {
    console.log(id)
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
        this.prService.approved(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'อนุมัติรายการสำเร็จ',
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


        this.prService.unapproved(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'รายการสำเร็จแล้ว',
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


  onCreatePo(id: any) {

    this.cartPoService.removeAllCart();
    this.router.navigate(['/admin/store/purchases/po/add', id]);

  }

  onRouter(value: string) {
    this.poService.findPoByPoId(this.token.getUser().uniqueKey, value).subscribe({
      next: (data) => {
        this.router.navigate(['/admin/store/purchases/po/detail', data.id]);
      },
    });

  }
}

