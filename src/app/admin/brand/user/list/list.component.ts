import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { UserService } from '../../../../_services/user.service';
import { User } from '../../../../_model/user';
import { StorageService } from '../../../../_services/storage.service';
import { BranchService } from '../../../../_services/branch.service';
import { Branch } from '../../../../_model/branch';
import { UserProfile } from '../../../../_model/user-profile';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  focus: any;
  focus1: any;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};


  title = '';
  category = '';
  page = 1;
  pageSize = 10;
  count = 0;
  role: string[];

  imageToShow: any = 'assets/img/account.png';

  users: User[] = [];

  getAllBranch: Branch[] = [];
  getBranchById: Branch;

  user: UserProfile;


  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  userForm: FormGroup;

  get f() { return this.userForm.controls; }

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private token: StorageService,
    private branchService: BranchService,
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        roles: ['', Validators.required],

        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        branch: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[A-Za-z0-9_.]+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    this.retrieveUser();
    this.retrieveAllBranch();
  }

  retrieveAllBranch() {
    this.branchService.findAll(this.token.getUser().uniqueKey)
      .subscribe({
        next: (data) => {

          this.getAllBranch = data;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  onChangeBranch(event: any) {

    this.branchService.get(this.token.getUser().uniqueKey, event.target.value)
      .subscribe({
        next: (data) => {

          this.getBranchById = data;
        },
        error: (e) => console.error(e)
      });
  }

  retrieveUser() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.userService.getAllByUniqueKey(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {
          const { users, totalItems } = data;

          this.users = users;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
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
    this.retrieveUser();

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

  onChangePosition(role: any) {


    if (role.target.value == "Admin") {
      this.role = ['admin'];
    } else if (role.target.value == "Writer") {
      this.role = ['writer'];
    }

  }


  onDetail(id: string) {
    this.router.navigate(['/admin/user/edit', id]);
  }


  create() {

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
    this.user.roles = [this.f['roles'].value];
    this.user.brandId = this.getBranchById.id;
    this.user.username = this.token.getUser().uniqueKey;

    this.userService.create(this.user)
      .subscribe({
        next: (res) => {


          if (res.message == "Successfully!") {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มผู้ใช้งานสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.reloadPage();
            })
          }

        },
        error: (error) => {
          console.log(error.error)

          this.loadingBar.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            text: error.error.message,
          });

        }
      });


  }
  reloadPage(): void {
    window.location.reload();
  }

  onDelete(id: any) {

    Swal.fire({
      title: 'ลบข้อมูลผู้ใช้งานระบบ?',
      text: "คุณต้องกาลบข้อมูลผู้ใช้งานระบบ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();

        this.userService.delete(id)
          .subscribe({
            next: (data) => {


              if (data.message == "Successfully!") {
                this.loadingBar.hide();

                Swal.fire({
                  icon: 'success',
                  title: 'ลบข้อมูลสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.retrieveUser();
                });

              }



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
