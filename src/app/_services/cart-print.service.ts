import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { Ingredients } from "../_model/ingredients";



@Injectable({
  providedIn: 'root'
})
export class CartPrintService {

  public cartItemList: Ingredients[] = [];


  cartSubject = new Subject();

  constructor() { }

  getProductCartItemList() {
    return this.cartItemList;
  }

  loadCart(): void {
    this.cartItemList = JSON.parse(sessionStorage.getItem("cart_print_items")!) ?? [];
  }



  addProductToCart(product: Ingredients) {

    product.checked = true;

    this.cartItemList.push(product);
    sessionStorage.setItem("cart_print_items", JSON.stringify(this.cartItemList));

    this.getTotalPrice();
  }


  saveCart(): void {
    sessionStorage.setItem('cart_print_items', JSON.stringify(this.cartItemList));
  }


  getTotalPrice() {
    let total: number = 0;

    this.cartItemList.map(item => {
      total += (item.price * item.quantityRequest);
    });
    return total;

  }




  removeProductFromCart(product: Ingredients) {
    const index = this.cartItemList.findIndex(o => o.id === product.id);

    if (index > -1) {
      this.cartItemList.splice(index, 1);
      sessionStorage.setItem("cart_print_items", JSON.stringify(this.cartItemList));
    }

  }

  removeAllCart() {
    this.cartItemList = [];
    sessionStorage.removeItem("cart_print_items")
  }

  itemInCart(product: Ingredients): boolean {
    return this.cartItemList.findIndex(o => o.id === product.id) > -1;
  }
}
