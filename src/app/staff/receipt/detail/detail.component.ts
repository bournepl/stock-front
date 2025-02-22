import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Ingredients } from '../../../_model/ingredients';
import { RiDetail } from '../../../_model/riDetail';
import { Supplier } from '../../../_model/supplier';
import { User } from '../../../_model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiPayment } from '../../../_model/riPayment';
import { RiService } from '../../../_services/ri.service';
import { StorageService } from '../../../_services/storage.service';
import { RiPaymentService } from '../../../_services/ri-payment.service';
import { CartRiService } from '../../../_services/cart-ri.service';
import { PoService } from '../../../_services/po.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  focus1: any;
  focus: any;

  cartItemList: Ingredients[] = [];
  title = '';
  page = 1;
  pageSize = 10;
  count = 0;
  getOrderDetail: RiDetail;

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

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  @ViewChild('staticModal2', { static: false }) staticModal2: ModalDirective;



  paymentForm: FormGroup;
  paymentUpdateForm: FormGroup;

  get f() {
    return this.paymentForm.controls;
  }
  get fUpdate() {
    return this.paymentUpdateForm.controls;
  }

  getRiPayment: RiPayment[];
  riPayment: RiPayment;
  getRiPaymentById: RiPayment;

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private riService: RiService,
    private token: StorageService,
    private riPaymentService: RiPaymentService,
    private cartRiService: CartRiService,
    private poService: PoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.retrievlRiDetail();
  }




  retrievlRiDetail() {
    this.loadingBar.show();

    this.route.params.subscribe((params) => {
      this.riService.findById(params['id']).subscribe(
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
    this.router.navigate(['/admin/store/purchases/ri/print', id]);
  }

  onCheckCartQuantity(product: Ingredients) {
    let quantity = this.cartItemList.find((p) => p.id == product.id)!.quantityRequest;

    console.log(product.quantityRequest)

    if (quantity < 1) {
      this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = 1;
    }
    this.cartRiService.saveCart();
  }

  onAddQuantity(product: Ingredients, index: any) {
    this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = +product.quantityRequest + 1;
    this.cartRiService.saveCart();

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartRiService.cartSubject.next(this.totalItem);
    this.loadCart();
  }

  onRemoveQuantity(product: Ingredients, index: any) {
    this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = +product.quantityRequest - 1;
    this.cartRiService.saveCart();

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartRiService.cartSubject.next(this.totalItem);
    this.loadCart();
  }

  onSearchChange(product: Ingredients, index: any) {

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartRiService.cartSubject.next(this.totalItem);
    this.loadCart();
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
        this.riService.approved(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'อนุมัติรายการสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.retrievlRiDetail();

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



}

