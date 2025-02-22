import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { CartPrintService } from '../../../../_services/cart-print.service';
import { Ingredients } from '../../../../_model/ingredients';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent {

  cartItemList: Ingredients[];

  getProduct: Ingredients[];
  constructor(
    private router: Router,
    private cartService: CartPrintService,

  ) { }

  ngOnInit(): void {
    this.loadCart();

  }


  loadCart() {
    this.cartService.loadCart();
    this.cartItemList = this.cartService.getProductCartItemList();


  }
  onPrint() {
    this.print();
  }

  print() {

    window.print();
  }

  onBack() {
    this.router.navigate(["/admin/store/ingredients/print-barcode/list"]);
  };
}
