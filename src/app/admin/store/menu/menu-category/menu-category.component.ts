import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { MenuCategory } from '../../../../_model/menu-category';
import { MenuCategoryService } from '../../../../_services/menu-category.service';
import { StorageService } from '../../../../_services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../../../../_services/excel.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html',
  styleUrl: './menu-category.component.scss'
})
export class MenuCategoryComponent {
  focus: any;
  focus1: any;

  title = '';
  page = 1;
  pageSize = 10;
  count = 0;


  categoryForm: FormGroup;
  categoryUpdateForm: FormGroup;
  @ViewChild('staticModal', { static: false }) staticModal: ModalDirective;
  @ViewChild('staticModal2', { static: false }) staticModal2: ModalDirective;


  category: MenuCategory;
  getCategoryById: MenuCategory;
  getCategory: MenuCategory[];

  get f() {
    return this.categoryForm.controls;
  }
  get fUpdate() {
    return this.categoryUpdateForm.controls;
  }

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileName: string;
  @ViewChild('staticModalImport', { static: false }) staticModalImport: ModalDirective;

  fileNameExport = 'MenuCategorySheet.xlsx';

  constructor(
    private router: Router,
    private categoryService: MenuCategoryService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private excelService: ExcelService
  ) {

  }

  ngOnInit(): void {



    this.categoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: [''],
    });

    this.categoryUpdateForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: [''],
    });

    this.retrieveCategory();

  }
  retrieveCategory() {

    this.loadingBar.show();
    const params = this.getRequestParams(this.title, this.page, this.pageSize);
    this.categoryService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;

          this.getCategory = result;
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
  onKeyUp(event: any) {
    this.title = event.target.value;
    this.page = 1;
    this.retrieveCategory();

  }

  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveCategory();
  }
  showChildModal(): void {
    this.staticModal.show();
  }
  hideChildModal(): void {

    this.staticModal.hide();
  }
  showChildModal2(): void {
    this.staticModal2.show();
  }
  hideChildModal2(): void {

    this.staticModal2.hide();
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveCategory()
  }

  create() {
    if (this.categoryForm.invalid) {
      return;
    }

    // console.log(this.branchForm);
    this.loadingBar.show();
    this.category = new MenuCategory();

    this.category.menuCategoryName = this.f['categoryName'].value;
    this.category.description = this.f['description'].value;
    this.category.menuCategoryId = this.f['categoryId'].value;
    this.category.uniqueKey = this.token.getUser().uniqueKey;
    this.category.branchId = this.token.getBranchId();

    this.categoryService.create(this.token.getUser().uniqueKey, this.category)
      .subscribe({
        next: (res) => {


          if (res.message == "Successfully!") {

            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'เพิ่มประเภทเมนูสำเร็จ',
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

  onDetail(id: string) {
    this.loadingBar.show();

    this.categoryService.getById(this.token.getUser().uniqueKey, id).subscribe(
      data => {
        this.getCategoryById = data;
        this.categoryUpdateForm.patchValue({ categoryName: this.getCategoryById.menuCategoryName });
        this.categoryUpdateForm.patchValue({ categoryId: this.getCategoryById.menuCategoryId });
        this.categoryUpdateForm.patchValue({ description: this.getCategoryById.description });
        this.loadingBar.hide();
      },
      error => {
        this.loadingBar.hide();
        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          confirmButtonColor: '#07cdae',
          text: error.message,
        });

      });

    this.showChildModal2();
  }
  update() {

    if (this.categoryUpdateForm.invalid) {
      return;
    }
    this.loadingBar.show();

    this.category = new MenuCategory();

    this.category.menuCategoryName = this.fUpdate['categoryName'].value;
    this.category.menuCategoryId = this.fUpdate['categoryId'].value;
    this.category.description = this.fUpdate['description'].value;
    this.category.uniqueKey = this.token.getUser().uniqueKey;
    this.category.branchId = this.token.getBranchId();

    this.categoryService.update(this.token.getUser().uniqueKey, this.getCategoryById.id, this.category).subscribe(
      reponse => {

        if (reponse.message == "Successfully!") {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขประเภทเมนูสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.hideChildModal2();
            this.retrieveCategory();

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
  onDelete(id: any) {


    Swal.fire({
      title: 'ลบประเภทเมนู',
      text: "คุณต้องกาลบประเภทเมนู?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();

        this.categoryService.delete(id)
          .subscribe({
            next: (data) => {

              if (data.message == "Successfully!") {
                this.loadingBar.hide();

                Swal.fire({
                  icon: 'success',
                  title: 'ลบประเภทเมนูสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.retrieveCategory();
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


  /**
  *
  * Import Data
  *
  *
  */

  showChildModalImport(): void {
    this.staticModalImport.show();
  }
  hideChildModalImport(): void {

    this.staticModalImport.hide();
  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles!.item(0)!.name;
  }


  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {

        this.currentFile = file;

        this.excelService.uploadMenuCategory(this.token.getUser().uniqueKey, this.token.getBranchId(), this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              if (event.body.message == "Successfully!") {
                this.loadingBar.hide();
                Swal.fire({
                  icon: 'success',
                  title: 'Uploaded the file successfully',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.reloadPage();

                })

              }
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            Swal.fire({
              icon: "warning",
              title: 'Oops...',
              confirmButtonColor: '#07cdae',
              text: this.message,
            })


            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }

  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileNameExport);
  }

}

