import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { UserService } from '../../../../_services/user.service';
import { StorageService } from '../../../../_services/storage.service';
import { IngredientsCategoryService } from '../../../../_services/ingredients-category.service';
import { IngredientsService } from '../../../../_services/ingredients.service';
import { CartIngredientService } from '../../../../_services/cart-Ingredient.service';
import { PrService } from '../../../../_services/pr.service';
import { User } from '../../../../_model/user';
import { Ingredients } from '../../../../_model/ingredients';
import { IngredientsCategory } from '../../../../_model/ingredients-category';
import { PrDetail } from '../../../../_model/prDetail';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {

  focus1: any;
  focus: any;
  imageToShow: any = 'assets/img/noimage.png';

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;


  dateForm: FormGroup;
  get fDate() {
    return this.dateForm.controls;
  }


  getUserById: User;

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

  cartItemList: Ingredients[] = [];
  description: string = '';

  categoryId = '';
  search = '';
  page = 1;
  pageSize = 10;
  count = 0;

  getCategory: IngredientsCategory[] = [];
  getIngredients: Ingredients[] = [];

  orderItem: Ingredients[] = [];
  prDetail: PrDetail;

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private userService: UserService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private categoryService: IngredientsCategoryService,
    private ingredientsService: IngredientsService,
    public datepipe: DatePipe,
    private cartService: CartIngredientService,
    private prService: PrService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {

    this.dateForm = this.formBuilder.group({
      date: ['', Validators.required],

    });
    this.cartService.removeAllCart();
    this.retrieveCategory();
    this.retrieveIngredient();
    this.retrieveUser();
  }

  showChildModal(): void {

    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
  }

  retrieveUser() {
    this.loadingBar.show();
    this.userService.get(this.token.getUser().username).subscribe({
      next: (data) => {
        this.getUserById = data;
        this.loadingBar.hide();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  onChangeVat(event: any) {
    this.selectedVat = event.target.value;

    this.loadCart();
  }


  loadCart() {
    this.cartService.loadCart();
    this.cartItemList = this.cartService.getProductCartItemList();
    this.totalItem = this.cartItemList.length;
    this.totalQuantity = this.cartItemList.map((data) => +data.quantityRequest).reduce((acc, value) => acc + value, 0);

    this.total = this.cartService.getTotalPrice();

    this.totalShipping = this.total + this.shipping;


    this.totalDiscount = (+this.totalShipping) - (+this.discountValue);

    this.total = this.cartService.getTotalPrice();

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

    this.discountValue = (+this.discount);


    this.loadCart();
  }


  retrieveCategory() {

    this.loadingBar.show();
    this.categoryService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId(),)
      .subscribe({
        next: (data) => {
          this.getCategory = data;

        },
        error: (err) => {
          console.log(err);

        }
      });
  }


  handlePageChange(event: number): void {

    this.page = event;
    this.retrieveIngredient();
  }
  retrieveIngredient() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.search, this.categoryId, this.page, this.pageSize);

    this.ingredientsService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;
          this.getIngredients = result;
          this.getIngredients.filter((data) => data.checked = false);
          this.count = totalItems;
          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }


  getRequestParams(searchTitle: string, categoryId: string, page: number, pageSize: number): any {
    let params: any = {};

    if (categoryId) {
      params['categoryId'] = categoryId;
    }

    if (searchTitle) {
      params['search'] = searchTitle;
    }

    if (page) {
      params['page'] = page - 1;
    }

    if (pageSize) {
      params['size'] = pageSize;
    }

    return params;
  }
  onChange(event: any) {

    if (event.target.value == "") {
      this.categoryId = "";
      this.retrieveIngredient();
    } else {
      this.categoryId = event.target.value;
      this.retrieveIngredient();

    }

  }


  onKeyUp(event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.retrieveIngredient();
  }

  selectItem(isSelected: any, product: Ingredients) {


    if (isSelected.target.checked == true) {

      product.selectChecked = true;
      product.checked = true;
      this.cartService.addProductToCart(product);

      this.cartItemList = [...this.cartService.getProductCartItemList()];


      this.loadCart();

    }
    else {
      this.cartService.removeProductFromCart(product);

      this.cartItemList = [...this.cartService.getProductCartItemList()];
      this.loadCart();
    }


  }

  onBack() {
    this.cartService.removeAllCart();
    this.router.navigate(["/manager/purchases/pr/list"]);
  }

  onConfrim() {
    this.loadCart();
    this.hideChildModal()
  }


  onRemove(product: Ingredients) {
    this.cartService.removeProductFromCart(product);

    this.getIngredients.find((p) => p.id == product.id)!.checked = false;

    console.log(this.getIngredients)

    this.loadCart();
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

  onCreate() {

    if (this.dateForm.invalid) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณากรอกวันที่ขอซื้อ',
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



    this.prDetail = new PrDetail();


    this.prDetail.items = this.orderItem;
    this.prDetail.itemsLength = this.totalItem;
    this.prDetail.description = this.description;
    this.prDetail.user = this.getUserById;
    this.prDetail.total = this.total;
    this.prDetail.totalAll = this.totalAll;
    this.prDetail.totalDiscount = this.totalDiscount;
    this.prDetail.discount = this.discountValue;
    this.prDetail.totalVat = this.totalVat;
    this.prDetail.vat = this.vat;
    this.prDetail.vatType = this.selectedVat;
    this.prDetail.totalShipping = this.totalShipping;
    this.prDetail.shipping = this.shipping;
    this.prDetail.dateRequest = this.fDate['date'].value.day + "/" + this.fDate['date'].value.month + "/" + this.fDate['date'].value.year;
    this.prDetail.uniqueKey = this.token.getUser().uniqueKey;
    this.prDetail.branchId = this.token.getBranchId();
    this.prDetail.reference = [''];

    Swal.fire({
      title: 'คุณได้ตรจสอบรายการ?',
      text: "ต้องการสร้างใบขอซื้อสินค้า",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();
        this.prService.create(this.token.getUser().admin, this.prDetail).subscribe(
          (reponse) => {
            if (reponse.message == 'Successfully!') {
              this.loadingBar.hide();

              Swal.fire({
                icon: 'success',
                title: 'เพิ่มใบขอซื้อสำเร็จ',
                showConfirmButton: false,
                timer: 1200,
              }).then(() => {
                this.cartService.removeAllCart();
                this.router.navigate(["/manager/purchases/pr/list"]);
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
