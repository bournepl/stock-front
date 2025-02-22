import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { RiDetail } from '../../../../_model/riDetail';
import { Ingredients } from '../../../../_model/ingredients';
import { Company } from '../../../../_model/company';
import { User } from '../../../../_model/user';
import { Branch } from '../../../../_model/branch';
import { RiService } from '../../../../_services/ri.service';
import { StorageService } from '../../../../_services/storage.service';
import { UserInfoService } from '../../../../_services/user-info.service';
import { BranchService } from '../../../../_services/branch.service';
import { CompanyService } from '../../../../_services/company.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent {
  getOrderDetail: RiDetail;


  cartItemList: Ingredients[];

  url: any = '';
  imageLogo: string = '';

  getCompany: Company;

  getUser: User;

  getBranch: Branch;
  imageToShow: any = 'assets/img/noimage.png';

  constructor(
    private router: Router,
    private orderService: RiService,
    private loadingBar: NgxSpinnerService,
    private route: ActivatedRoute,
    private token: StorageService,
    private element: ElementRef,
    private userService: UserInfoService,
    private branchService: BranchService,
    private companyService: CompanyService
  ) { }


  ngOnInit(): void {

    this.url = "assets/img/noimage.png";

    this.retrieveCompany();
    this.getSales();

  }

  retrieveCompany() {

    this.loadingBar.show();
    this.companyService.getByUniqueKey(this.token.getUser().uniqueKey)
      .subscribe(data => {
        this.getCompany = data


        if (this.getCompany.imageUrl == "") {
          this.imageLogo = "assets/img/noimage.png";

        } else {
          this.imageLogo = this.getCompany.imageUrl;

          this.loadingBar.hide();
        }
      });

  }
  retrieveBranch(id: string) {

    this.branchService.get(this.token.getUser().uniqueKey, id)
      .subscribe({
        next: (data) => {
          this.getBranch = data;
          this.loadingBar.hide();

        },
        error: (e) => console.error(e)
      });


  }


  getSales() {
    this.loadingBar.show();

    this.route.params.subscribe(params => {
      this.orderService.findById(params['id']).subscribe(
        data => {
          this.getOrderDetail = data;

          this.cartItemList = this.getOrderDetail.items;
          this.getUser = this.getOrderDetail.user;
          this.retrieveBranch(this.getOrderDetail.branchId);
          this.loadingBar.hide();
        },
        error => {
          this.loadingBar.hide();
          Swal.fire({
            icon: "warning",
            title: 'Oops...',
            confirmButtonColor: '#07cdae',
            text: error.error.message,
          });

        });
    });
  }

  onPrint() {
    this.print();
  }

  print() {

    window.print();
  }

  onBack(id: any) {
    this.router.navigate(["/manager/purchases/pr/detail", id]);
  };

}
