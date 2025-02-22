import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { UserService } from '../../../../_services/user.service';
import { StorageService } from '../../../../_services/storage.service';
import { CartRiService } from '../../../../_services/cart-ri.service';
import { PoService } from '../../../../_services/po.service';
import { RiService } from '../../../../_services/ri.service';
import { Supplier } from '../../../../_model/supplier';
import { User } from '../../../../_model/user';
import { Ingredients } from '../../../../_model/ingredients';
import { PoDetail } from '../../../../_model/poDetail';
import { RiDetail } from '../../../../_model/riDetail';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent {

  focus1: any;
  focus: any;
  imageToShow: any = 'assets/img/noimage.png';

  cartItemList: Ingredients[] = [];
  getUser: User;
  getUserById: User;
  getSupplierById: Supplier;

  getOrderDetail: PoDetail;


  selectedVat = 'ไม่มีภาษี';
  shipping: number = 0;
  total: number = 0;
  totalVat: number = 0;
  totalAll: number = 0;
  vat: number = 0;
  totalShipping: number = 0;
  discountValue: number = 0;
  totalDiscount: number = 0;
  discount: number = 0;

  totalItem: number = 0;
  totalQuantity: number = 0;

  orderItem: Ingredients[] = [];

  riDetail: RiDetail;

  description: string = '';


  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private userService: UserService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private cartService: CartRiService,
    private riService: RiService,
    private poService: PoService,
    private route: ActivatedRoute


  ) { }

  ngOnInit() {

    this.retrievlPoDetail();
    this.retrieveUser();
  }

  retrievlPoDetail() {
    this.loadingBar.show();


    this.route.params.subscribe((params) => {

      this.poService.findById(params['id']).subscribe(
        (data) => {
          this.getOrderDetail = data;

          this.getSupplierById = this.getOrderDetail.supplier;
          this.cartItemList = this.getOrderDetail.items;
          this.cartService.cartItemList = this.getOrderDetail.items;
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


  retrieveUser() {
    this.loadingBar.show();
    this.userService.get(this.token.getUser().uniqueKey).subscribe({
      next: (data) => {
        this.getUserById = data;
        this.loadingBar.hide();
      },
      error: (err) => {
        console.log(err);
      },
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
  onCheckCartQuantity(product: Ingredients) {
    let quantity = this.cartItemList.find((p) => p.id == product.id)!.quantityRequest;

    if (quantity < 1) {
      this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = 1;
    }
    this.cartService.saveCart();
  }

  onAddQuantity(product: Ingredients, index: any) {
    this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = +product.quantityRequest + 1;
    this.cartService.saveCart();

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartService.cartSubject.next(this.totalItem);
    this.loadCart();
  }

  onRemoveQuantity(product: Ingredients, index: any) {
    this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = +product.quantityRequest - 1;
    this.cartService.saveCart();

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartService.cartSubject.next(this.totalItem);
    this.loadCart();
  }

  onSearchChange(product: Ingredients, index: any) {

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartService.cartSubject.next(this.totalItem);
    this.loadCart();
  }
  onBack() {
    this.cartService.removeAllCart();
    this.router.navigate(["/manager/purchases/ri/list"]);
  }

  onCreate() {

    this.orderItem = [];
    for (let i in this.cartItemList) {
      this.orderItem.push({
        id: this.cartItemList[i].id,

        ingredientName: this.cartItemList[i].ingredientName,
        ingredientId: this.cartItemList[i].ingredientId,
        brand: this.cartItemList[i].brand,
        price: this.cartItemList[i].price,
        purchaseUnit: this.cartItemList[i].purchaseUnit,
        stockAmount: this.cartItemList[i].stockAmount,
        stockUnit: this.cartItemList[i].stockUnit,
        useUnit: this.cartItemList[i].useUnit,
        useAmount: this.cartItemList[i].useAmount,
        amount: this.cartItemList[i].amount,
        quantity: this.cartItemList[i].quantity,
        safetyStockMax: this.cartItemList[i].safetyStockMax,
        safetyStockMin: this.cartItemList[i].safetyStockMin,
        maxStock: this.cartItemList[i].maxStock,
        leadtime: this.cartItemList[i].leadtime,
        description: this.cartItemList[i].description,
        status: this.cartItemList[i].status,
        date: this.cartItemList[i].date,
        dateFormat: this.cartItemList[i].dateFormat,
        barCodeNumber: this.cartItemList[i].barCodeNumber,
        branchId: this.cartItemList[i].branchId,
        checked: false,
        uniqueKey: this.cartItemList[i].uniqueKey,
        imageUrl: this.cartItemList[i].imageUrl,
        category: this.cartItemList[i].category,
        number: this.cartItemList[i].number,
        quantityRequest: this.cartItemList[i].quantityRequest,
        selectChecked: false,
        average: this.cartItemList[i].average,
        uniqueId: this.cartItemList[i].uniqueId,
      });
    }


    if (this.orderItem.length == 0) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณาเลือกสินค้า',
        confirmButtonColor: '#07cdae',

      })

      return;
    }



    this.riDetail = new RiDetail();

    this.riDetail.items = this.orderItem;
    this.riDetail.itemsLength = this.totalItem;
    this.riDetail.description = this.description;
    this.riDetail.user = this.getUserById;
    this.riDetail.supplier = this.getSupplierById;
    this.riDetail.total = this.total;
    this.riDetail.totalAll = this.totalAll;
    this.riDetail.totalDiscount = this.totalDiscount;
    this.riDetail.discount = this.discountValue;
    this.riDetail.totalVat = this.totalVat;
    this.riDetail.vat = this.vat;
    this.riDetail.vatType = this.selectedVat;
    this.riDetail.totalShipping = this.totalShipping;
    this.riDetail.shipping = this.shipping;
    this.riDetail.uniqueKey = this.token.getUser().uniqueKey;
    this.riDetail.branchId = this.token.getBranchId();
    this.riDetail.reference = this.getOrderDetail.id;

    Swal.fire({
      title: 'คุณได้ตรจสอบรายการ?',
      text: "ต้องการสร้างใบรับสินค้า",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.loadingBar.show();
        this.riService.create(this.token.getUser().uniqueKey, this.riDetail).subscribe(
          (reponse) => {
            if (reponse.message == 'Successfully!') {
              this.loadingBar.hide();

              Swal.fire({
                icon: 'success',
                title: 'เพิ่มใบรับสินค้าสำเร็จ',
                showConfirmButton: false,
                timer: 1200,
              }).then(() => {
                this.cartService.removeAllCart();
                this.router.navigate(["/manager/purchases/ri/list"]);
              });
            }
          },
          (error) => {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              confirmButtonColor: '#07cdae',
              text: error.message,
            });
          }
        );

      }
    });


  }

}
