import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { BranchService } from '../../../_services/branch.service';
import { StorageService } from '../../../_services/storage.service';
import { Branch } from '../../../_model/branch';
import { Province } from '../../../_model/province';
import { District } from '../../../_model/district';
import { AddressService } from '../../../_services/address.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {





  focus: any;
  focus1: any;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};


  title = '';
  page = 1;
  pageSize = 10;
  count = 0;
  role: string[];

  imageToShow: any = 'assets/img/noimage.png';
  getBranch: Branch[] = [];
  branch: Branch;
  getBranchById: Branch;

  getProvince: Province[];
  getDistrict: District[];

  getDistrictById: District;
  getProvinceByPid: Province;



  @ViewChild('staticModal2', { static: false }) staticModal2: ModalDirective;
  branchUpdateForm: FormGroup;

  get fUpdate() {
    return this.branchUpdateForm.controls;
  }

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private addressService: AddressService,
    private token: StorageService,

  ) { }

  ngOnInit(): void {

    this.branchUpdateForm = this.formBuilder.group({
      branchId: ['', Validators.required],
      branchName: ['', Validators.required],
      branchPhone: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      zipcode: ['', Validators.required],
    });

    this.addressService.getProvince().subscribe(data => {
      this.getProvince = data;
    });
    this.retrieveBranch();
  }

  retrieveBranch(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.branchService.getAll(this.token.getUser().uniqueKey, params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;

          this.getBranch = result;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
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

  onChangeProvince(pid: any) {



    this.addressService.getProvinceByPid(pid.value).subscribe(data => {

      this.getProvinceByPid = data;

    });
    this.addressService.getDistrict(pid.value).subscribe(data => {

      this.getDistrict = data;

    });
  }
  onChangeDistrict(id: any) {
    this.addressService.getDistrictById(id.value).subscribe(data => {

      this.getDistrictById = data;

    });
  }
  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveBranch();

  }

  handlePageChange(event: number): void {
    this.page = event;

  }

  showChildModal2(id: any): void {
    this.loadingBar.show();


    this.branchService.get(this.token.getUser().uniqueKey, id)
      .subscribe({
        next: (data) => {

          this.getBranchById = data;

          this.addressService.getProvinceByPid(this.getBranchById.province.pid).subscribe(data => {
            this.getProvinceByPid = data;
          });
          this.addressService.getDistrictById(this.getBranchById.district.id).subscribe(data => {
            this.getDistrictById = data;
          });

          this.addressService.getDistrict(this.getBranchById.province.pid).subscribe(data => {
            this.getDistrict = data;
          });

          this.branchUpdateForm.patchValue({ branchId: this.getBranchById.branchId });
          this.branchUpdateForm.patchValue({ branchName: this.getBranchById.branchName });
          this.branchUpdateForm.patchValue({ branchPhone: this.getBranchById.phone });
          this.branchUpdateForm.patchValue({ address: this.getBranchById.address });
          this.branchUpdateForm.patchValue({ district: this.getBranchById.district.id });
          this.branchUpdateForm.patchValue({ province: this.getBranchById.province.pid });
          this.branchUpdateForm.patchValue({ zipcode: this.getBranchById.zipcode });

          this.loadingBar.hide();

          this.staticModal2.show();
        },
        error: (e) => console.error(e)
      });



  }
  hideChildModal2(): void {

    this.staticModal2.hide();
  }

  onUpdate() {

    if (this.branchUpdateForm.invalid) {
      return;
    }
    this.loadingBar.show();
    // console.log(this.branchForm);

    this.branch = new Branch();


    this.branch.branchId = this.fUpdate['branchId'].value;
    this.branch.branchName = this.fUpdate['branchName'].value;
    this.branch.phone = this.fUpdate['branchPhone'].value;
    this.branch.address = this.fUpdate['address'].value;
    this.branch.province = this.getProvinceByPid;
    this.branch.district = this.getDistrictById;
    this.branch.zipcode = this.fUpdate['zipcode'].value;


    //  console.log(this.branch);
    this.branchService.update(this.token.getUser().uniqueKey, this.getBranchById.id, this.branch)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'แก้ไขสาขาสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {

              this.hideChildModal2();
              this.retrieveBranch();
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
  onManagement(id: string) {
    this.router.navigate(["/admin/store"]);
    this.token.saveBranchId(id);
  }
}
