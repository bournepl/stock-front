import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { StorageService } from '../../../../../_services/storage.service';
import { IngredientsService } from '../../../../../_services/ingredients.service';
import { IngredientsCategoryService } from '../../../../../_services/ingredients-category.service';
import { CartPrintService } from '../../../../../_services/cart-print.service';
import { IngredientsCategory } from '../../../../../_model/ingredients-category';
import { Ingredients } from '../../../../../_model/ingredients';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  focus1: any;
  focus: any;

  categoryId = '';
  search = '';
  page = 1;
  pageSize = 10;
  count = 0;

  getIngredients: Ingredients[] = [];


  totalItem: number = 0;
  totalQuantity: number = 0;

  imageToShow: any = 'assets/img/noimage.png';

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;


  getCategory: IngredientsCategory[] = [];

  cartItemList: Ingredients[] = [];

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private token: StorageService,
    private ingredientsService: IngredientsService,
    private categoryService: IngredientsCategoryService,
    private cartService: CartPrintService,

  ) { }

  ngOnInit(): void {
    this.cartService.removeAllCart();
    this.retrieveCategory();
    this.retrieveIngredient();
  }

  loadCart() {
    this.cartService.loadCart();
    this.cartItemList = this.cartService.getProductCartItemList();
    this.totalItem = this.cartItemList.length;
    this.totalQuantity = this.cartItemList.map((data) => +data.quantityRequest).reduce((acc, value) => acc + value, 0);


  }
  retrieveCategory() {

    this.loadingBar.show();
    this.categoryService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId(),)
      .subscribe({
        next: (data) => {
          this.getCategory = data;
          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  showChildModal(): void {
    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
  }

  onCancel() {
    this.cartService.removeAllCart();
    this.getIngredients.filter((data) => data.checked = false);
    this.loadCart();
    this.staticModal.hide();
  }
  onRemoveAll() {
    this.cartService.removeAllCart();
    this.getIngredients.filter((data) => data.checked = false);
    this.loadCart();

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

  handlePageChange(event: number): void {

    this.page = event;
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
  onRemove(product: Ingredients) {
    this.cartService.removeProductFromCart(product);

    this.getIngredients.find((p) => p.id == product.id)!.checked = false;

    this.loadCart();
  }
  onConfrim() {
    this.loadCart();
    this.hideChildModal()
  }

  onPrint() {
    this.router.navigate(["/admin/store/ingredients/print-barcode/print"]);
  }

}
