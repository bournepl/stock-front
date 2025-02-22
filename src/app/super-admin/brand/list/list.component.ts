import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from '../../../_model/company';
import { UserProfile } from '../../../_model/user-profile';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyService } from '../../../_services/company.service';
import { UserService } from '../../../_services/user.service';
import Swal from 'sweetalert2';
import { UserResponse } from '../../../_model/user-response';
import { StorageService } from '../../../_services/storage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  getCompany: Company[] = [];

  focus: any;
  focus1: any;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};


  title = '';
  category = '';
  page = 1;
  pageSize = 9;
  count = 0;
  role: string[];

  imageToShow: any = 'assets/img/noimage.png';


  user: UserProfile;


  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;

  userForm: FormGroup;

  get f() { return this.userForm.controls; }

  getUser: UserProfile;
  userResponse: UserResponse;

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private token: StorageService,

  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9_.]+$/)]],
      confirmPassword: ['', Validators.required],
      brandName: ['', Validators.required],
      brandPhone: ['', Validators.required],
      brandId: ['', Validators.required],
      brandEmail: ['', Validators.email],
      taxId: [''],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.loadingBar.show();


    this.retrieveCompany();


  }

  retrieveCompany() {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);
    this.companyService.getAll(params)
      .subscribe({
        next: (res) => {
          const { result, totalItems } = res;

          this.getCompany = result;
          this.count = totalItems;

          this.loadingBar.hide();

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


  onDetail(id: string) {
    this.router.navigate(["/super-admin/brand/brand/detail", id]);
  }


  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveCompany();

  }

  handlePageChange(event: number): void {
    this.page = event;

  }
  showChildModal(): void {
    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
  }


  onSubmit() {

    if (this.userForm.invalid) {
      return;
    }

    // console.log(this.branchForm);
    this.loadingBar.show();
    this.user = new UserProfile();

    this.user.name = this.f['name'].value;
    this.user.phone = this.f['phone'].value;
    this.user.email = this.f['email'].value;
    this.user.password = this.f['password'].value;
    this.user.roles = ['owner'];
    this.user.taxId = this.f['taxId'].value;
    this.user.brandEmail = this.f['brandEmail'].value;
    this.user.brandId = this.f['brandId'].value
    this.user.brandName = this.f['brandName'].value
    this.user.brandPhone = this.f['brandPhone'].value

    this.userService.signup(this.user)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'เพิ่ม Brand สำเร็จ',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.hideChildModal();
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

  reloadPage(): void {
    window.location.reload();
  }


  onManage(id: string) {


    this.retrieveUser(id);


  }

  retrieveUser(id: string) {

    this.userService.get(id)
      .subscribe({
        next: (res) => {
          this.getUser = res;

          this.userResponse = new UserResponse();
          this.userResponse.uniqueKey = this.getUser.uniqueKey;
          this.userResponse.email = this.getUser.email;
          this.userResponse.id = this.getUser.id;
          this.userResponse.name = this.getUser.name;
          this.userResponse.username = this.getUser.username;
          this.userResponse.host = true;
          this.token.saveUser(this.userResponse);

          if (this.getUser.branchId) {

            this.token.saveBranchId(this.getUser.branchId);
          }

          this.router.navigate(["/admin"]);
          this.loadingBar.hide();

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
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

