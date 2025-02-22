import { Component, ViewChild } from '@angular/core';
import { CompanyService } from '../../../_services/company.service';
import { StorageService } from '../../../_services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Company } from '../../../_model/company';
import Swal from 'sweetalert2';
import { Province } from '../../../_model/province';
import { District } from '../../../_model/district';
import { BranchService } from '../../../_services/branch.service';
import { Branch } from '../../../_model/branch';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AddressService } from '../../../_services/address.service';
import { UserService } from '../../../_services/user.service';
import { UserProfile } from '../../../_model/user-profile';
import { UserResponse } from '../../../_model/user-response';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  focus: any;
  focus1: any;

  imageToShow: any = 'assets/img/noimage.png';
  getCompany: Company;

  company: Company;

  companyForm: FormGroup;
  get f() { return this.companyForm.controls; }

  fileName: string;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  url: any = '';

  getProvince: Province[];
  getDistrict: District[];

  getDistrictById: District;
  getProvinceByPid: Province;


  getBranch: Branch[] = [];
  branch: Branch;
  getBranchById: Branch;

  title = '';
  page = 1;
  pageSize = 6;
  count = 0;

  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  @ViewChild('staticModal2', { static: false }) staticModal2: ModalDirective;

  branchForm: FormGroup;
  branchUpdateForm: FormGroup;

  get fBranch() {
    return this.branchForm.controls;
  }
  get fUpdate() {
    return this.branchUpdateForm.controls;
  }

  constructor(
    private companyService: CompanyService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private userService: UserService,
    private branchService: BranchService,
    private loadingBar: NgxSpinnerService
  ) { }


  ngOnInit(): void {

    this.companyForm = this.formBuilder.group({

      brandName: ['', Validators.required],
      brandPhone: ['', Validators.required],
      brandId: ['', Validators.required],
      brandEmail: ['', Validators.email],
      taxId: [''],

    });

    this.branchForm = this.formBuilder.group({
      branchId: ['', Validators.required],
      branchName: ['', Validators.required],
      branchPhone: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      zipcode: ['', Validators.required],
    });


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

    this.retrieveCompany();
  }

  retrieveCompany() {

    this.route.params.subscribe(params => {
      this.companyService.getById(params['id'])
        .subscribe({
          next: (res) => {
            this.getCompany = res;

            this.companyForm.patchValue({ brandId: this.getCompany.companyId });
            this.companyForm.patchValue({ brandEmail: this.getCompany.email });
            this.companyForm.patchValue({ taxId: this.getCompany.taxId });
            this.companyForm.patchValue({ brandPhone: this.getCompany.phone });
            this.companyForm.patchValue({ brandName: this.getCompany.companyName });

            if (this.getCompany.imageUrl == "" || this.getCompany.imageUrl == null) {
              this.imageToShow = "assets/img/noimage.png";

            } else {
              this.imageToShow = this.getCompany.imageUrl;
            }

            this.retrieveBranch(this.getCompany);

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
    });


  }


  retrieveBranch(company: Company): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.branchService.getAll(company.uniqueKey, params)
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

  showChildModal(): void {
    this.staticModal.show();
  }

  hideChildModal(): void {
    this.branchForm.reset();
    this.staticModal.hide();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveBranch(this.getCompany);
  }

  showChildModal2(id: any): void {
    this.loadingBar.show();


    this.branchService.get(this.getCompany.uniqueKey, id)
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
    this.branchUpdateForm.reset();
    this.staticModal2.hide();
  }
  onDelete(id: any) {

    Swal.fire({
      title: 'ลบข้อมูลสาขา?',
      text: "คุณต้องการลบข้อมูลสาขา",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();

        this.branchService.delete(id)
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
                  this.retrieveBranch(this.getCompany);
                });

              }


              this.loadingBar.hide();
            },
            error: (err) => {
              this.loadingBar.hide();
              Swal.fire({
                icon: "warning",
                title: 'Oops...',
                text: err.message,
              });
            }
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
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)!.size > 1024000) {

      this.selectedFiles = undefined!;
      Swal.fire({
        icon: "warning",
        title: 'ไฟล์ภาพใหณ่เกินไป!',
        text: "ไฟล์ภาพควรมีขนาดไม่เกิน 1 M",
      })

    } else {

      if (this.selectedFiles && this.selectedFiles.item(0)) {

        this.fileName = this.selectedFiles.item(0)!.name;
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFiles.item(0)!); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.url = reader.result!.toString();

        }
        reader.onerror = function (error) {
          console.log('Error: ', error);
        }
      }

    }
  }
  public delete(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFiles = undefined!;
    this.fileName = "";
    this.url = null;
  }
  onEditCompany() {
    if (this.companyForm.invalid) {
      return;
    }
    console.log(this.companyForm.value);

    this.loadingBar.show();

    this.company = new Company();
    this.company.taxId = this.f['taxId'].value;
    this.company.email = this.f['brandEmail'].value;
    this.company.companyId = this.f['brandId'].value
    this.company.companyName = this.f['brandName'].value
    this.company.phone = this.f['brandPhone'].value

    this.companyService.update(this.getCompany.uniqueKey, this.getCompany.id, this.company)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {
            this.loadingBar.hide();

            Swal.fire({
              icon: 'success',
              title: 'แก้ไขข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.retrieveCompany();
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
  onUpload() {
    if (this.selectedFiles == undefined) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณาเลือกไฟล์โลโก้',
      })

    } else {

      this.currentFileUpload = this.selectedFiles.item(0)!;
      this.loadingBar.show();

      console.log(this.getCompany.id)

      this.companyService.uploadImageLogo(this.getCompany.uniqueKey, this.getCompany.id, this.currentFileUpload)
        .subscribe({
          next: (res: any) => {
            this.loadingBar.hide();

            if (res.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสินค้าสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {

                this.retrieveCompany();

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
  }

  onManage(id: string) {

  }

  onSubmit() {

    if (this.branchForm.invalid) {
      return;
    }

    // console.log(this.branchForm);

    this.branch = new Branch();

    this.branch.uniqueKey = this.getCompany.uniqueKey;
    this.branch.branchId = this.fBranch['branchId'].value;
    this.branch.branchName = this.fBranch['branchName'].value;
    this.branch.phone = this.fBranch['branchPhone'].value;
    this.branch.address = this.fBranch['address'].value;
    this.branch.province = this.getProvinceByPid;
    this.branch.district = this.getDistrictById;
    this.branch.zipcode = this.fBranch['zipcode'].value;
    this.loadingBar.show();

    this.branchService.create(this.token.getUser().admin, this.branch)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {
            this.loadingBar.hide();

            Swal.fire({
              icon: 'success',
              title: 'เพิ่มสาขาสำเร็จ',
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
    this.retrieveCompany();

  }

  onRemoveBrand() {
    Swal.fire({
      title: 'ลบข้อมูลแบรนด์',
      text: "คุณต้องการลบข้อมูลแบรนด์?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();

        this.companyService.delete(this.getCompany.id)
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
                  this.router.navigate(["/super-admin/brand/brand"]);
                });

              }


              this.loadingBar.hide();
            },
            error: (err) => {
              this.loadingBar.hide();
              Swal.fire({
                icon: "warning",
                title: 'Oops...',
                text: err.message,
              });
            }
          });

      }
    });
  }

  reloadPage(): void {
    window.location.reload();
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
    this.branchService.update(this.getCompany.uniqueKey, this.getBranchById.id, this.branch)
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



}
