import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IngredientsService } from '../../_services/ingredients.service';
import { StorageService } from '../../_services/storage.service';
import { Router } from '@angular/router';
import { CheckStockService } from '../../_services/checkstock.service';
import { Ingredients } from '../../_model/ingredients';
import { CheckStock } from '../../_model/check-stock';
import Swal from 'sweetalert2';
import { UserService } from '../../_services/user.service';
import { User } from '../../_model/user';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-check-stock',
  templateUrl: './check-stock.component.html',
  styleUrl: './check-stock.component.scss'
})
export class CheckStockComponent {
  focus: any;
  focus1: any;

  title = '';
  date = '';
  page = 1;
  pageSize = 10;
  count = 0;

  pageNon = 1;
  pageSizeNon = 10;
  countNon = 0;

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  @ViewChild('staticModalNonCheck', { static: false }) staticModalNonCheck: ModalDirective;

  dropdownList: any = [];
  dropdownSettings: any = {};

  getIngredients: Ingredients[] = [];
  chackForm: FormGroup;

  getIngredientsById: Ingredients;

  stockUnit: string = '';
  useUnit: string = '';

  checkStock: CheckStock;


  getUserById: User;

  today = inject(NgbCalendar).getToday();

  getCheckStock: CheckStock[] = [];

  getNonCheckStock: Ingredients[] = [];
  stockUnitNonCheck: string = '';
  useUnitNonCheck: string = '';

  chackNonForm: FormGroup;
  getIngredientsByIdNonCheck: Ingredients;
  get f() {
    return this.chackForm.controls;
  }

  get fCheck() {
    return this.chackNonForm.controls;
  }

  numberCheck: number = 0;

  constructor(
    private router: Router,
    private token: StorageService,
    private ingredientsService: IngredientsService,
    private checkStockService: CheckStockService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private userService: UserService,

  ) {

  }

  ngOnInit(): void {

    this.date = ('0' + this.today.day).slice(-2) + '/' + ('0' + (this.today.month)).slice(-2) + '/' + this.today.year;

    this.dropdownSettings = {
      singleSelection: true,
      enableSearchFilter: true,
      text: '',
      labelKey: "ingredientName",
      searchBy: ['ingredientName', 'barCodeNumber']
    };

    this.chackForm = this.formBuilder.group({
      ingredients: ['', Validators.required],
      quantity: [0, Validators.required],
      amount: [0, Validators.required],
    });

    this.chackNonForm = this.formBuilder.group({

      quantity: [0, Validators.required],
      amount: [0, Validators.required],
    });


    this.retrieveIngredients();
    this.retrieveStock();
    this.retrieveUser();
    this.retrieveStockNonCheck();

  }
  retrieveStock() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.date, this.page, this.pageSize);

    this.checkStockService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;

          this.getCheckStock = result;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  getRequestParams(searchTitle: string, date: string, page: number, pageSize: number): any {
    let params: any = {};

    if (date) {
      params['date'] = date;
    }

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
  retrieveIngredients() {
    this.loadingBar.show();
    this.ingredientsService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {
          this.getIngredients = data;

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


  onItemSelect(item: any) {

    this.getIngredientsById = item;

    this.stockUnit = item.stockUnit;
    this.useUnit = item.useUnit;
  }

  create() {

    if (this.chackForm.invalid) {
      return;
    }


    this.loadingBar.show();
    this.checkStock = new CheckStock();

    this.checkStock.ingredient = this.getIngredientsById;
    this.checkStock.amount = this.f['amount'].value;
    this.checkStock.quantity = this.f['quantity'].value;
    this.checkStock.uniqueKey = this.token.getUser().uniqueKey;
    this.checkStock.branchId = this.token.getBranchId();
    this.checkStock.user = this.getUserById;

    this.checkStockService.create(this.checkStock)
      .subscribe({
        next: (res) => {
          if (res.message == "Successfully!") {

            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'ตรวจสอบสินค้าสำเร็จ',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.hideChildModal();

              this.retrieveStockNonCheck();
              this.retrieveStock()

            })
          } else if (res.message == "Already taken!") {
            this.loadingBar.hide();

            Swal.fire({
              title: 'รายการนี้ตรวจสอบสำเร็จแล้ว',
              text: "ต้องการแก้ไขรายการใช่หรือไม่?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: '#4caf50',
              cancelButtonColor: '#999999',
              confirmButtonText: 'ยืนยัน',
              cancelButtonText: 'ยกเลิก'
            }).then((result) => {
              if (result.value) {

                this.loadingBar.show();

                this.checkStockService.update(this.checkStock)
                  .subscribe({
                    next: (res) => {


                      if (res.message == "Successfully!") {

                        this.loadingBar.hide();
                        Swal.fire({
                          icon: 'success',
                          title: 'ตรวจสอบสินค้าสำเร็จ',
                          showConfirmButton: false,
                          timer: 2000
                        }).then(() => {
                          this.hideChildModal();
                          this.retrieveStockNonCheck();
                          this.retrieveStock()
                        })
                      }
                    },
                    error: (error) => {


                      this.loadingBar.hide();
                      Swal.fire({
                        icon: "warning",
                        title: 'Oops...',
                        text: error.message,
                      });

                    }
                  });



              }
            });



          }


        },
        error: (error) => {

          this.loadingBar.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: error.message,
          });

        }
      });

  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveStock();
  }

  onDateSelect(event: NgbDate) {

    this.date = ('0' + event.day).slice(-2) + '/' + ('0' + (event.month)).slice(-2) + '/' + event.year;
    this.page = 1;
    this.retrieveStock();

  }

  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveStock();
    this.retrieveStockNonCheck();
  }



  retrieveStockNonCheck() {

    this.loadingBar.show();

    const params = this.getRequestParamsNonCheck(this.title, this.date, this.pageNon, this.pageSizeNon);

    this.checkStockService.getAllNonCheck(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;

          this.getNonCheckStock = result;
          this.countNon = totalItems;

          console.log(this.getNonCheckStock)

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  getRequestParamsNonCheck(searchTitle: string, dateNon: string, pageNon: number, pageSizeNon: number): any {
    let params: any = {};

    if (dateNon) {
      params['date'] = dateNon;
    }

    if (searchTitle) {
      params['title'] = searchTitle;
    }

    if (pageNon) {
      params['page'] = pageNon - 1;
    }

    if (pageSizeNon) {
      params['size'] = pageSizeNon;
    }

    return params;
  }

  showNonCheck(item: Ingredients) {



    this.getIngredientsByIdNonCheck = item;
    this.stockUnitNonCheck = item.stockUnit;
    this.useUnitNonCheck = item.useUnit;
    this.staticModalNonCheck.show();


  }
  handlePageChangeNonCheck(event: number): void {
    this.pageNon = event;
    this.retrieveStockNonCheck();
  }
  hideChildModalNonCheck(): void {

    this.staticModalNonCheck.hide();
  }
  createNonCheck() {

    if (this.chackNonForm.invalid) {
      return;
    }


    this.loadingBar.show();
    this.checkStock = new CheckStock();

    this.checkStock.ingredient = this.getIngredientsByIdNonCheck;
    this.checkStock.amount = this.fCheck['amount'].value;
    this.checkStock.quantity = this.fCheck['quantity'].value;
    this.checkStock.uniqueKey = this.token.getUser().uniqueKey;
    this.checkStock.branchId = this.token.getBranchId();
    this.checkStock.user = this.getUserById;

    this.checkStockService.create(this.checkStock)
      .subscribe({
        next: (res) => {
          if (res.message == "Successfully!") {

            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'ตรวจสอบสินค้าสำเร็จ',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {

              this.reloadPage();
            })
          } else if (res.message == "Already taken!") {
            this.loadingBar.hide();

            Swal.fire({
              title: 'รายการนี้ตรวจสอบสำเร็จแล้ว',
              text: "ต้องการแก้ไขรายการใช่หรือไม่?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: '#4caf50',
              cancelButtonColor: '#999999',
              confirmButtonText: 'ยืนยัน',
              cancelButtonText: 'ยกเลิก'
            }).then((result) => {
              if (result.value) {

                this.loadingBar.show();

                this.checkStockService.update(this.checkStock)
                  .subscribe({
                    next: (res) => {


                      if (res.message == "Successfully!") {

                        this.loadingBar.hide();
                        Swal.fire({
                          icon: 'success',
                          title: 'ตรวจสอบสินค้าสำเร็จ',
                          showConfirmButton: false,
                          timer: 2000
                        }).then(() => {
                          this.reloadPage();
                        })
                      }
                    },
                    error: (error) => {


                      this.loadingBar.hide();
                      Swal.fire({
                        icon: "warning",
                        title: 'Oops...',
                        text: error.message,
                      });

                    }
                  });



              }
            });



          }


        },
        error: (error) => {

          this.loadingBar.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: error.message,
          });

        }
      });

  }

  reloadPage(): void {
    window.location.reload();
  }
}
