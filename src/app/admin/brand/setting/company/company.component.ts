import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


import Swal from 'sweetalert2';
import { CompanyService } from '../../../../_services/company.service';
import { Company } from '../../../../_model/company';
import { StorageService } from '../../../../_services/storage.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {



  role: string[] = [];
  roles: string[] = [];

  url: any = '';
  currentFileUpload: File;
  progress = 0;
  selectedFiles: FileList;
  fileName: string;
  imageToShow: any = 'assets/img/noimage.png';
  companyForm: FormGroup;

  getCompany: Company;
  company: Company;

  get f() { return this.companyForm.controls; }

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private route: ActivatedRoute,
    private token: StorageService,
  ) { }

  ngOnInit(): void {


    this.companyForm = this.formBuilder.group({

      brandName: ['', Validators.required],
      brandPhone: ['', Validators.required],
      brandId: ['', Validators.required],
      brandEmail: ['', Validators.email],
      taxId: [''],

    });
    this.retrieveCompany();

  }

  retrieveCompany() {

    console.log(this.token.getUser())
    this.companyService.getByUniqueKey(this.token.getUser().uniqueKey)
      .subscribe({
        next: (res) => {
          this.getCompany = res;

          console.log(res)

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
  onChangePosition(role: any) {


    if (role.target.value == "Admin") {
      this.role = ['admin'];
    } else if (role.target.value == "Writer") {
      this.role = ['writer'];
    }

  }
  onBack() {
    this.router.navigate(["/admin/brand/user/list"]);
  }

  public deleteImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileName = "";
    this.url = "";
    this.selectedFiles = undefined!;
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)!.size > 1024000) {

      Swal.fire({
        icon: "warning",
        title: 'ไฟล์ภาพมีขนาดใหณ่เกินไป! (ไม่เกิน 1 M)',
        confirmButtonColor: '#07cdae',

      })
      this.selectedFiles = undefined!;

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


}
