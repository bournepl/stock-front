import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { Supplier } from '../../../../_model/supplier';
import { PrService } from '../../../../_services/pr.service';
import { PoService } from '../../../../_services/po.service';
import { StorageService } from '../../../../_services/storage.service';
import { UserService } from '../../../../_services/user.service';
import { AddressService } from '../../../../_services/address.service';
import { SupplierService } from '../../../../_services/supplier.service';
import { User } from '../../../../_model/user';

import { Ingredients } from '../../../../_model/ingredients';
import { CartPoService } from '../../../../_services/cart-po.service';
import { PoDetail } from '../../../../_model/poDetail';
import { PrDetail } from '../../../../_model/prDetail';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {

  imageToShow: any = 'assets/img/noimage.png';
  focus1: any;
  focus: any;

  getSupplierById: Supplier;
  getSupplier: Supplier[];
  title = '';
  page = 1;
  pageSize = 10;
  count = 0;
  poDetail: PoDetail;


  getUserById: User;

  getOrderDetail: PrDetail;
  prId: string;

  cartItemList: Ingredients[] = [];
  getProductList: Ingredients[] = [];

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

  description: string = '';

  @ViewChild('staticModalProduct', { static: false }) staticModalProduct: ModalDirective;

  orderItem: Ingredients[] = [];


  constructor(
    private router: Router,
    private prService: PrService,
    private poService: PoService,
    private loadingBar: NgxSpinnerService,
    private token: StorageService,
    private userService: UserService,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private addressService: AddressService,
    private cartService: CartPoService,
    private supplierService: SupplierService
  ) { }

  @ViewChild('staticModalSupplier', { static: false }) staticModalSupplier: ModalDirective;


  ngOnInit() {

    this.retrieveUser();
    this.retrievlPrDetail();
    this.retrievlPrDetailProduct();
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
  retrievlPrDetail() {
    this.loadingBar.show();


    this.route.params.subscribe((params) => {
      this.prId = params['id'];
      this.prService.findById(params['id']).subscribe(
        (data) => {
          this.getOrderDetail = data;

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

  retrievlPrDetailProduct() {
    this.loadingBar.show();

    this.route.params.subscribe((params) => {
      this.prService.findById(params['id']).subscribe(
        (data) => {
          this.getProductList = data.items;

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

  onChangeShipping() {
    this.loadCart();
  }
  onChangeDiscount(searchValue: any) {
    this.discount = searchValue.target.value;

    if (this.discount <= 0) {
      this.discount = 0;
    }

    this.discountValue = this.discount;


    this.loadCart();
  }

  onChangeVat(value: any) {
    this.selectedVat = value.target.value;

    this.loadCart();
  }

  showChildModalSupplier(): void {
    this.retrieveSupplier();
    this.staticModalSupplier.show();
  }
  hideChildModalSupplier(): void {
    this.staticModalSupplier.hide();
  }

  handlePageChangeSupplier(event: number): void {
    this.page = event;
    this.retrieveSupplier();
  }
  onSelectSupplier(id: any) {
    this.hideChildModalSupplier();
    this.loadingBar.show();
    this.supplierService.findById(this.token.getUser().uniqueKey, id).subscribe((data) => {
      this.getSupplierById = data;
      this.loadingBar.hide();

    });
  }

  retrieveSupplier() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.supplierService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;

          this.getSupplier = result;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {

          this.loadingBar.hide();
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
  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveSupplier();

  }




  showChildModalProduct(): void {

    this.staticModalProduct.show();
  }
  hideChildModalProduct(): void {
    this.staticModalProduct.hide();
  }

  onRemove(product: Ingredients) {
    this.getProductList.find((p) => p.id == product.id)!.checked = false;

    const index = this.cartItemList.findIndex(
      (o) => o.id === product.id
    );

    if (index > -1) {
      this.cartItemList.splice(index, 1);
    }

  }

  onCheckCartQuantity(product: Ingredients) {
    let quantity = this.cartItemList.find((p) => p.id == product.id)!.quantityRequest;

    if (quantity < 1) {
      this.cartItemList.find((p) => p.id == product.id)!.quantityRequest = 1;
    }
    this.cartService.saveCart();
  }


  onSearchChange(product: Ingredients, index: any) {

    this.onCheckCartQuantity(product);

    this.totalItem = this.cartItemList.length;
    this.cartService.cartSubject.next(this.totalItem);
    this.loadCart();
  }


  onConfrim() {


    for (let item of this.getProductList) {

      if (!item.selectChecked) {
        if (item.checked) {


          if (!this.itemInCartList(item)) {
            this.cartItemList.push(item);
            this.cartItemList.find((p) => p.id == item.id)!.checked = true;
          }


        } else {
          const index = this.cartItemList.findIndex(
            (o) => o.id === item.id
          );

          if (index > -1) {
            this.cartItemList.splice(index, 1);
          }

        }
      }


    }
    this.loadCart();
    this.hideChildModalProduct();

  }
  onSelectProduct(item: Ingredients) {
    console.log(item);

    item.checked = !item.checked;
    if (item.checked) {

      this.getProductList.find((p) => p.id == item.id)!.checked = true;

    } else {

      this.getProductList.find((p) => p.id == item.id)!.checked = false;
    }


  }
  itemInCartList(product: Ingredients): boolean {
    return this.cartItemList.findIndex(o => o.id === product.id) > -1;
  }

  onBack() {
    this.cartService.removeAllCart();
    this.router.navigate(["/manager/purchases/po/list"]);
  }

  onCreate() {

    if (this.getSupplierById == null) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณาเลือกผู้จัดจำหน่าย',
        confirmButtonColor: '#07cdae',

      })
      return;
    }

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
        selectChecked: this.cartItemList[i].selectChecked,
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



    this.poDetail = new PoDetail();

    this.poDetail.items = this.orderItem;
    this.poDetail.itemsLength = this.totalItem;
    this.poDetail.description = this.description;
    this.poDetail.user = this.getUserById;
    this.poDetail.supplier = this.getSupplierById;
    this.poDetail.total = this.total;
    this.poDetail.totalAll = this.totalAll;
    this.poDetail.totalDiscount = this.totalDiscount;
    this.poDetail.discount = this.discountValue;
    this.poDetail.totalVat = this.totalVat;
    this.poDetail.vat = this.vat;
    this.poDetail.vatType = this.selectedVat;
    this.poDetail.totalShipping = this.totalShipping;
    this.poDetail.shipping = this.shipping;
    this.poDetail.uniqueKey = this.token.getUser().uniqueKey;
    this.poDetail.branchId = this.token.getBranchId();
    this.poDetail.reference = this.getOrderDetail.id;

    Swal.fire({
      title: 'คุณได้ตรจสอบรายการ?',
      text: "ต้องการสร้างใบสั่งซื้อสินค้า",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.loadingBar.show();
        this.poService.create(this.token.getUser().uniqueKey, this.poDetail).subscribe(
          (reponse) => {
            if (reponse.message == 'Successfully!') {
              this.loadingBar.hide();

              Swal.fire({
                icon: 'success',
                title: 'เพิ่มใบสั่งซื้อสำเร็จ',
                showConfirmButton: false,
                timer: 1200,
              }).then(() => {
                this.cartService.removeAllCart();
                this.router.navigate(["/manager/purchases/po/list"]);
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
