import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../../_services/user.service';
import { StorageService } from '../../../../_services/storage.service';
import { User } from '../../../../_model/user';
import { Menu } from '../../../../_model/menu';
import { MenuService } from '../../../../_services/menu.service';
import { MenuCategoryService } from '../../../../_services/menu-category.service';
import { MenuCategory } from '../../../../_model/menu-category';
import Swal from 'sweetalert2';
import { OrderDetail } from '../../../../_model/orderDetail';
import { OrderService } from '../../../../_services/order.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  focus1: any;
  focus: any;

  users: User[] = [];
  orderForm: FormGroup;
  getUser: User;


  search = '';
  categoryId = '';
  page = 1;
  pageSize = 10;
  count = 0;
  getMenu: Menu[] = [];
  getCategory: MenuCategory[] = [];
  cartList: Menu[] = [];
  cartMenuList: Menu[] = [];


  get f() {
    return this.orderForm.controls;
  }

  orderDetail: OrderDetail;

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;

  showChildModal(): void {
    this.retrieveCategory();
    this.retrieveMenu();
    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
  }
  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private manuService: MenuService,
    private categoryService: MenuCategoryService,
    private orderService: OrderService,
    private token: StorageService,

  ) { }
  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({

      channelType: ['', Validators.required],
      paymentType: ['', Validators.required],
      user: ['', Validators.required],
      description: [''],

    });
    this.retrieveUser();

  }

  retrieveUser() {

    this.loadingBar.show();


    this.userService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {

          this.users = data;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
          this.loadingBar.hide();
        }
      });
  }
  onChangeUser(event: any) {
    this.userService.getById(event.value).subscribe(data => {
      this.getUser = data;
      this.loadingBar.hide();


    });
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
  retrieveMenu() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.search, this.categoryId, this.page, this.pageSize);

    this.manuService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;
          this.getMenu = result;
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
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveMenu();
  }

  onChange(event: any) {

    if (event.target.value == "") {
      this.categoryId = "";
      this.retrieveMenu();
    } else {
      this.categoryId = event.target.value;
      this.retrieveMenu();

    }

  }

  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveMenu();
  }
  onKeyUp(event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.retrieveMenu();
  }

  onAddProductToCart(product: Menu) {
    if (!this.itemInCart(product)) {
      this.cartMenuList.push(product);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'คุณเพิ่มเมนูซ้ำ',
        confirmButtonColor: '#07cdae',
      });
      return;
    }

    this.hideChildModal();
  }


  itemInCart(product: Menu): boolean {
    return this.cartMenuList.findIndex((o) => o.id === product.id) > -1;
  }

  onDelete(product: Menu) {
    const index = this.cartMenuList.findIndex(
      (o) => o.id === product.id
    );

    if (index > -1) {
      this.cartMenuList.splice(index, 1);
    }
  }

  onConfirm() {
    if (this.orderForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        confirmButtonColor: '#07cdae',
      });

      return;
    }

    Swal.fire({
      title: 'คุณต้องการเพิ่มรายการขาย',
      text: "คุณได้ตรวจสอบข้อมูลและต้องการเพิ่มรายการขาย?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmOrder();
      }
    })


  }

  confirmOrder() {

    this.cartList = [];
    for (let i in this.cartList) {
      this.cartMenuList.push({
        id: this.cartList[i].id,
        menuCategory: this.cartList[i].menuCategory,
        uniqueKey: this.cartList[i].uniqueKey,
        branchId: this.cartList[i].branchId,
        menuName: this.cartList[i].menuName,
        menuId: this.cartList[i].menuId,
        menuCode: this.cartList[i].menuCode,
        description: this.cartList[i].description,
        ingredients: this.cartList[i].ingredients,
        status: this.cartList[i].status,
        imageUrl: this.cartList[i].imageUrl,
        quantity: this.cartList[i].quantity,
        total: this.cartList[i].total,
        number: this.cartList[i].number,
        date: this.cartList[i].date,
        packageIngredients: this.cartList[i].packageIngredients,
        checked: this.cartList[i].checked,
        dateFormat: this.cartList[i].dateFormat

      });
    }

    this.orderDetail = new OrderDetail();

    this.orderDetail.uniqueKey = this.token.getUser().uniqueKey;
    this.orderDetail.branchId = this.token.getBranchId();
    this.orderDetail.description = this.f['description'].value;
    this.orderDetail.menu = this.cartMenuList;
    this.orderDetail.orderItemsLength = this.cartMenuList.length;
    this.orderDetail.channelType = this.f['channelType'].value;
    this.orderDetail.paymentType = this.f['paymentType'].value;
    this.orderDetail.user = this.getUser;



    this.loadingBar.show();
    this.orderService.create(this.orderDetail).subscribe(
      (reponse) => {
        if (reponse.message == 'Successfully!') {
          this.loadingBar.hide();

          Swal.fire({
            icon: 'success',
            title: 'เพิ่มรายการขายสำเร็จ',
            showConfirmButton: false,
            timer: 1200,
          }).then(() => {

            this.router.navigate(['/admin/store/sale/list']);

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

  onBack() {
    this.router.navigate(['/admin/store/sale/list']);

  }
  onSearchChange(product: Menu, index: any) {

    this.cartMenuList.find((p) => p.id == product.id)!.quantity = product.quantity;

  }
}
