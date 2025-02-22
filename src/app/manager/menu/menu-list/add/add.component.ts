import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { MenuCategoryService } from '../../../../_services/menu-category.service';
import { MenuService } from '../../../../_services/menu.service';
import { IngredientsService } from '../../../../_services/ingredients.service';
import { IngredientsCategoryService } from '../../../../_services/ingredients-category.service';
import { StorageService } from '../../../../_services/storage.service';
import { MenuCategory } from '../../../../_model/menu-category';
import { Ingredients } from '../../../../_model/ingredients';
import { IngredientsCategory } from '../../../../_model/ingredients-category';
import { Menu } from '../../../../_model/menu';

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
  @ViewChild('staticModalPackage', { static: false }) staticModalPackage: ModalDirective;

  getCategory: MenuCategory[] = [];
  getCategoryById: MenuCategory;

  menuForm: FormGroup;
  get f() {
    return this.menuForm.controls;
  }

  search = '';
  page = 1;
  pageSize = 10;
  count = 0;
  categoryId = '';

  getIngredients: Ingredients[] = [];
  getIngredientsPackage: Ingredients[] = [];


  getCategoryIn: IngredientsCategory[] = [];


  public cartIngredientsList: Ingredients[] = [];

  searchPackage = '';
  pagePackage = 1;
  pageSizePackage = 10;
  countPackage = 0;
  categoryIdPackage = '';

  public cartIngredientsListPackage: Ingredients[] = [];

  public cartList: Ingredients[] = [];
  public cartListPackage: Ingredients[] = [];

  menu: Menu;

  constructor(
    public formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private categoryService: MenuCategoryService,
    private manuService: MenuService,
    private ingredientsService: IngredientsService,
    private categoryInService: IngredientsCategoryService,
    private router: Router,
    private token: StorageService
  ) { }

  showChildModal(): void {
    this.retrieveCategoryIn();
    this.retrieveIngredient();
    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
  }

  showChildModalPackage(): void {
    this.retrieveCategoryIn();
    this.retrieveIngredientPackage();
    this.staticModalPackage.show();
  }
  hideChildModalPackage(): void {

    this.staticModalPackage.hide();
  }

  ngOnInit(): void {

    this.menuForm = this.formBuilder.group({
      category: ['', Validators.required],
      menuName: ['', Validators.required],
      description: [''],

    });

    this.loadingBar.show();

    this.retrieveCategory();

  }
  retrieveCategoryIn() {

    this.loadingBar.show();
    this.categoryInService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId(),)
      .subscribe({
        next: (data) => {
          this.getCategoryIn = data;


        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  retrieveCategory() {
    this.loadingBar.show();
    this.categoryService
      .findAll(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {
          this.getCategory = data;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onChangeCategory(event: any) {
    this.loadingBar.show();
    if (event.value != undefined) {
      this.categoryService.getById(this.token.getUser().uniqueKey, event.value).subscribe({
        next: (data) => {
          this.getCategoryById = data;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  retrieveIngredient() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.search, this.categoryId, this.page, this.pageSize);

    this.ingredientsService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
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

  retrieveIngredientPackage() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.searchPackage, this.categoryIdPackage, this.pagePackage, this.pageSizePackage);

    this.ingredientsService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;
          this.getIngredientsPackage = result;
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
  onKeyUp(event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.retrieveIngredient();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveIngredient();
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

  onAddProductToCart(product: Ingredients) {
    if (!this.itemInCart(product)) {
      this.cartIngredientsList.push(product);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'คุณเพิ่มวัตถุดิบซ้ำ',
        confirmButtonColor: '#07cdae',
      });
      return;
    }

    this.hideChildModal();
  }


  itemInCart(product: Ingredients): boolean {
    return this.cartIngredientsList.findIndex((o) => o.id === product.id) > -1;
  }

  onSearchChange(product: Ingredients, index: any) {


    this.cartIngredientsList.find((p) => p.id == product.id)!.amount = product.amount;

  }
  onDelete(product: Ingredients) {
    const index = this.cartIngredientsList.findIndex(
      (o) => o.id === product.id
    );

    if (index > -1) {
      this.cartIngredientsList.splice(index, 1);
    }
  }

  /**
   *
   *
   * Package
   *
   *
   */


  onKeyUpPackage(event: any) {
    this.searchPackage = event.target.value;
    this.pagePackage = 1;
    this.retrieveIngredientPackage();
  }

  handlePageChangePackage(event: number): void {
    this.pagePackage = event;
    this.retrieveIngredientPackage();
  }

  onChangePackage(event: any) {

    if (event.target.value == "") {
      this.categoryIdPackage = "";
      this.retrieveIngredientPackage();
    } else {
      this.categoryIdPackage = event.target.value;
      this.retrieveIngredientPackage();

    }

  }

  onAddProductToCartPackage(product: Ingredients) {
    if (!this.itemInCartPackage(product)) {
      this.cartIngredientsListPackage.push(product);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'คุณเพิ่มวัตถุดิบซ้ำ',
        confirmButtonColor: '#07cdae',
      });
      return;
    }

    this.hideChildModalPackage();
  }


  itemInCartPackage(product: Ingredients): boolean {
    return this.cartIngredientsListPackage.findIndex((o) => o.id === product.id) > -1;
  }

  onSearchChangePackage(product: Ingredients, index: any) {


    this.cartIngredientsListPackage.find((p) => p.id == product.id)!.amount = product.amount;

  }
  onDeletePackage(product: Ingredients) {
    const index = this.cartIngredientsListPackage.findIndex(
      (o) => o.id === product.id
    );

    if (index > -1) {
      this.cartIngredientsListPackage.splice(index, 1);
    }
  }


  create() {
    if (this.menuForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        confirmButtonColor: '#07cdae',
      });

      return;
    }

    this.cartList = [];
    for (let i in this.cartList) {
      this.cartIngredientsList.push({
        id: this.cartList[i].id,
        ingredientName: this.cartList[i].ingredientName,
        ingredientId: this.cartList[i].ingredientId,
        brand: this.cartList[i].brand,
        price: this.cartList[i].price,
        purchaseUnit: this.cartList[i].purchaseUnit,
        stockAmount: this.cartList[i].stockAmount,
        stockUnit: this.cartList[i].stockUnit,
        useUnit: this.cartList[i].useUnit,
        useAmount: this.cartList[i].useAmount,
        amount: this.cartList[i].amount,
        quantity: this.cartList[i].quantity,
        safetyStockMax: this.cartList[i].safetyStockMax,
        safetyStockMin: this.cartList[i].safetyStockMin,
        maxStock: this.cartList[i].maxStock,
        leadtime: this.cartList[i].leadtime,
        description: this.cartList[i].description,
        status: this.cartList[i].status,
        date: this.cartList[i].date,
        dateFormat: this.cartList[i].dateFormat,
        barCodeNumber: this.cartList[i].barCodeNumber,
        branchId: this.cartList[i].branchId,
        checked: false,
        uniqueKey: this.cartList[i].uniqueKey,
        imageUrl: this.cartList[i].imageUrl,
        category: this.cartList[i].category,
        number: this.cartList[i].number,
        quantityRequest: this.cartList[i].quantityRequest,
        selectChecked: false,
        average: this.cartList[i].average,
        uniqueId: this.cartList[i].uniqueId,
      });
    }
    if (this.cartIngredientsList.length == 0) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณาเลือกวัตถุดิบ',
        confirmButtonColor: '#07cdae',

      })

      return;
    }

    this.cartListPackage = [];
    for (let i in this.cartListPackage) {
      this.cartIngredientsListPackage.push({
        id: this.cartListPackage[i].id,
        ingredientName: this.cartListPackage[i].ingredientName,
        ingredientId: this.cartListPackage[i].ingredientId,
        brand: this.cartListPackage[i].brand,
        price: this.cartListPackage[i].price,
        purchaseUnit: this.cartListPackage[i].purchaseUnit,
        stockAmount: this.cartListPackage[i].stockAmount,
        stockUnit: this.cartListPackage[i].stockUnit,
        useUnit: this.cartListPackage[i].useUnit,
        useAmount: this.cartListPackage[i].useAmount,
        amount: this.cartListPackage[i].amount,
        quantity: this.cartListPackage[i].quantity,
        safetyStockMax: this.cartListPackage[i].safetyStockMax,
        safetyStockMin: this.cartListPackage[i].safetyStockMin,
        maxStock: this.cartListPackage[i].maxStock,
        leadtime: this.cartListPackage[i].leadtime,
        description: this.cartListPackage[i].description,
        status: this.cartListPackage[i].status,
        date: this.cartListPackage[i].date,
        dateFormat: this.cartListPackage[i].dateFormat,
        barCodeNumber: this.cartListPackage[i].barCodeNumber,
        branchId: this.cartListPackage[i].branchId,
        checked: false,
        uniqueKey: this.cartListPackage[i].uniqueKey,
        imageUrl: this.cartListPackage[i].imageUrl,
        category: this.cartListPackage[i].category,
        number: this.cartListPackage[i].number,
        quantityRequest: this.cartListPackage[i].quantityRequest,
        selectChecked: false,
        average: this.cartListPackage[i].average,
        uniqueId: this.cartListPackage[i].uniqueId,
      });
    }
    if (this.cartIngredientsListPackage.length == 0) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณาเลือกวัตถุดิบ Packaging',
        confirmButtonColor: '#07cdae',

      })

      return;
    }

    this.loadingBar.show();
    this.menu = new Menu();

    this.menu.menuName = this.f['menuName'].value;
    this.menu.description = this.f['description'].value;

    this.menu.menuCategory = this.getCategoryById;
    this.menu.ingredients = this.cartIngredientsList;
    this.menu.packageIngredients = this.cartIngredientsListPackage;

    this.menu.branchId = this.token.getBranchId();
    this.menu.uniqueKey = this.token.getUser().uniqueKey;

    this.manuService.create(this.token.getUser().uniqueKey, this.menu).subscribe({
      next: (res) => {



        if (res.message == 'Successfully!') {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มเมนูสำเร็จ',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.router.navigate(['/manager/menu/menu-list/list']);
          });
        }


      },
      error: (error) => {
        this.loadingBar.hide();
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: error.message,
        });
      },
    });

  }

  onBack() {
    this.router.navigate(['/manager/menu/menu-list/list']);
  }


}
