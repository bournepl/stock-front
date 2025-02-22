import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';


import Swal from 'sweetalert2';
import { Supplier } from '../../../../_model/supplier';
import { Province } from '../../../../_model/province';
import { District } from '../../../../_model/district';
import { StorageService } from '../../../../_services/storage.service';
import { AddressService } from '../../../../_services/address.service';
import { SupplierService } from '../../../../_services/supplier.service';


@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent {

  imageToShow: any = 'assets/img/account.png';

  getSupplierById: Supplier;
  supplier: Supplier;


  getProvince: Province[];
  getDistrict: District[];

  getDistrictById: District;
  getProvinceByPid: Province;

  supplierForm: FormGroup;
  get f() {
    return this.supplierForm.controls;
  }

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private token: StorageService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private supplierService: SupplierService

  ) { }

  ngOnInit(): void {
    this.supplierForm = this.formBuilder.group({

      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      address: ['', Validators.required],
      description: [''],
      idNumber: [''],
      province: ['', Validators.required],
      district: ['', Validators.required],
      zipcode: ['', Validators.required],
    });

    this.retrieveSupplier();

    this.addressService.getProvince().subscribe(data => {
      this.getProvince = data;
    });

  }

  retrieveSupplier() {

    this.loadingBar.show();
    this.route.params.subscribe(params => {
      this.supplierService.findById(this.token.getUser().uniqueKey, params['id'])
        .subscribe({
          next: (data) => {
            this.getSupplierById = data;
            this.addressService.getProvinceByPid(this.getSupplierById.province.pid).subscribe(data => {
              this.getProvinceByPid = data;
            });
            this.addressService.getDistrictById(this.getSupplierById.district.id).subscribe(data => {
              this.getDistrictById = data;
            });

            this.addressService.getDistrict(this.getSupplierById.province.pid).subscribe(data => {
              this.getDistrict = data;
            });


            this.supplierForm.patchValue({ name: this.getSupplierById.name });
            this.supplierForm.patchValue({ email: this.getSupplierById.email });
            this.supplierForm.patchValue({ phone: this.getSupplierById.phone });
            this.supplierForm.patchValue({ address: this.getSupplierById.address });
            this.supplierForm.patchValue({ idNumber: this.getSupplierById.idNumber });
            this.supplierForm.patchValue({ province: this.getSupplierById.province.pid });
            this.supplierForm.patchValue({ district: this.getSupplierById.district.id });
            this.supplierForm.patchValue({ zipcode: this.getSupplierById.zipcode });
            this.supplierForm.patchValue({ description: this.getSupplierById.description });


            this.loadingBar.hide();
          },
          error: (err) => {
            this.loadingBar.hide();
          }
        });
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
  onSubmit() {
    if (this.supplierForm.invalid) {
      return;
    }

    this.loadingBar.show();

    this.supplier = new Supplier();
    this.supplier.name = this.f['name'].value;
    this.supplier.email = this.f['email'].value;
    this.supplier.phone = this.f['phone'].value;
    this.supplier.address = this.f['address'].value;
    this.supplier.district = this.getDistrictById;
    this.supplier.province = this.getProvinceByPid;
    this.supplier.zipcode = this.f['zipcode'].value
    this.supplier.idNumber = this.f['idNumber'].value
    this.supplier.description = this.f['description'].value

    this.supplierService.update(this.token.getUser().uniqueKey, this.getSupplierById.id, this.supplier).subscribe(
      reponse => {

        if (reponse.message == "Successfully!") {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขผู้จัดจำหน่ายสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {

            this.retrieveSupplier();
          })
        }

      },
      error => {

        this.loadingBar.hide();
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          confirmButtonColor: '#07cdae',
          text: error.message,
        })

      })
  }
  onDelete(customerId: string) {

    Swal.fire({
      title: 'ลบข้อมูลผู้จัดจำหน่าย?',
      text: "คุณต้องการลบข้อมูลผู้จัดจำหน่ายนี้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingBar.show();
        this.supplierService.delete(customerId).subscribe(
          reponse => {

            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลผู้จัดจำหน่ายสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigate(["/admin/store/supplier/list"]);

              })
            }

          },
          error => {
            this.loadingBar.hide();
            Swal.fire({
              icon: "warning",
              title: 'Oops...',
              confirmButtonColor: '#07cdae',
              text: error.message,
            })

          });
      }
    })


  }
  onBack() {
    this.router.navigate(["/admin/store/supplier/list"]);
  }
}
