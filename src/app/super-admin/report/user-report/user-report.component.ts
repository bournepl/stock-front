import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyService } from '../../../_services/company.service';
import { UserService } from '../../../_services/user.service';
import { UserLoginService } from '../../../_services/user-login.service';
import { UserLogin } from '../../../_model/user-login';
import { BranchService } from '../../../_services/branch.service';
import { Company } from '../../../_model/company';
import { Branch } from '../../../_model/branch';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrl: './user-report.component.scss'
})
export class UserReportComponent {
  focus: any;
  focus1: any;

  imageToShow: any = 'assets/img/noimage.png';



  title = '';
  brand = '';
  page = 1;
  pageSize = 10;
  count = 0;

  users: UserLogin[] = [];

  getAllBranch: Branch[] = [];
  getCompany: Company[] = [];

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private userService: UserLoginService,
    private branchService: BranchService,
    private companyService: CompanyService,

  ) { }

  ngOnInit() {
    this.retrieveAllBranch();
    this.retrieveUser();
    this.retrieveCompany();
  }
  retrieveAllBranch() {
    this.branchService.findAllBranch()
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
  retrieveCompany() {
    this.companyService.findAll()
      .subscribe({
        next: (res) => {
          this.getCompany = res;
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
  retrieveUser() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.title, this.brand, this.page, this.pageSize);

    this.userService.getAll(params)
      .subscribe({
        next: (data) => {
          const { users, totalItems } = data;

          this.users = users;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  getRequestParams(searchTitle: string, brand: string, page: number, pageSize: number): any {
    let params: any = {};

    if (brand) {
      params['brand'] = brand;
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
  searchBrand(event: any): void {
    this.brand = event.target.value;
    this.page = 1;
    this.retrieveUser();
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveUser();
  }
  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveUser();

  }

}
