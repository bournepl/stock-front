import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { SupplierService } from '../../../_services/supplier.service';
import { StorageService } from '../../../_services/storage.service';
import { Supplier } from '../../../_model/supplier';
import { Province } from '../../../_model/province';
import { District } from '../../../_model/district';
import { AddressService } from '../../../_services/address.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent {

  focus: any;
  focus1: any;

  title = '';
  page = 1;
  pageSize = 10;
  count = 0;


  getProvince: Province[];
  getDistrict: District[];

  getDistrictById: District;
  getProvinceByPid: Province;


  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;

  getSupplier: Supplier[] = [];
  supplier: Supplier;
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

    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.supplierService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;

          this.getSupplier = result;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {

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
    this.retrieveSupplier();

  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveSupplier();
  }
  showChildModal(): void {
    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
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

  onDetail(id: string) {
    this.router.navigate(['/manager/supplier/edit', id]);
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
    this.supplier.branchId = this.token.getBranchId();
    this.supplier.uniqueKey = this.token.getUser().uniqueKey;

    this.supplierService.create(this.token.getUser().uniqueKey, this.supplier).subscribe(
      reponse => {

        if (reponse.message == "Successfully!") {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มผู้จัดจำหน่ายสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.hideChildModal();
            this.reloadPage();
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

          });
      }
    })


  }
  reloadPage(): void {
    window.location.reload();
  }
}

