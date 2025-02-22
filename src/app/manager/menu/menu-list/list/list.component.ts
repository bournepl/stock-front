import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { MenuCategoryService } from '../../../../_services/menu-category.service';
import { StorageService } from '../../../../_services/storage.service';
import { MenuService } from '../../../../_services/menu.service';
import { Menu } from '../../../../_model/menu';
import Swal from 'sweetalert2';
import { MenuCategory } from '../../../../_model/menu-category';
import { ExcelService } from '../../../../_services/excel.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  focus: any;
  focus1: any;

  search = '';
  categoryId = '';
  page = 1;
  pageSize = 10;
  count = 0;
  getMenu: Menu[] = [];
  menu: Menu;

  getCategory: MenuCategory[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileName: string;
  @ViewChild('staticModalImport', { static: false }) staticModalImport: ModalDirective;

  fileNameExport = 'MenuSheet.xlsx';

  constructor(
    private router: Router,
    private categoryService: MenuCategoryService,
    private token: StorageService,
    private manuService: MenuService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private excelService: ExcelService

  ) {

  }

  ngOnInit(): void {
    this.retrieveCategory();
    this.retrieveMenu();

  }
  retrieveCategory() {

    this.loadingBar.show();
    this.categoryService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId(),)
      .subscribe({
        next: (data) => {
          this.getCategory = data;

        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  retrieveMenu() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.search, this.categoryId, this.page, this.pageSize);

    this.manuService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {

          const { result, totalItems } = data;
          this.getMenu = result;
          this.count = totalItems;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }



  getRequestParams(searchTitle: string, categoryId: string, page: number, pageSize: number): any {
    let params: any = {};

    if (categoryId) {
      params['categoryId'] = categoryId;
    }

    if (searchTitle) {
      params['search'] = searchTitle;
    }

    if (page) {
      params['page'] = page - 1;
    }

    if (pageSize) {
      params['size'] = pageSize;
    }

    return params;
  }
  handlePageChange(event: number): void {
    this.page = event;

  }
  onAdd() {
    this.router.navigate(['/manager/menu/menu-list/add']);
  }
  onDetail(id: string) {
    this.router.navigate(['/manager/menu/menu-list/edit', id]);
  }

  onChangeStatus(event: any, id: any) {

    if (event.checked == false) {
      this.menu = new Menu();
      this.menu.status = event.checked;
      this.manuService.updateStatus(this.token.getUser().uniqueKey, id, this.menu).subscribe(
        reponse => {

          if (reponse.message == "Successfully!") {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'ปิดการขายชั่วคราว',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.retrieveMenu();

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

    } else {
      this.menu = new Menu();
      this.menu.status = event.checked;
      this.manuService.updateStatus(this.token.getUser().uniqueKey, id, this.menu).subscribe(
        reponse => {

          if (reponse.message == "Successfully!") {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'พร้อมขาย',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.retrieveMenu();

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

  }

  onChange(event: any) {

    if (event.target.value == "") {
      this.categoryId = "";
      this.retrieveMenu();
    } else {
      this.categoryId = event.target.value;
      this.retrieveMenu();

    }

  }


  onKeyUp(event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.retrieveMenu();
  }

  onDelete(id: any) {

    // console.log(id);
    Swal.fire({
      title: 'ลบเมนู?',
      text: "คุณต้องกาลบเมนู",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();

        this.manuService.delete(id)
          .subscribe({
            next: (data) => {

              // console.log(data)


              if (data.message == "Successfully!") {
                this.loadingBar.hide();

                Swal.fire({
                  icon: 'success',
                  title: 'ลบเมนูสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.retrieveMenu();
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

        this.excelService.uploadMenu(this.token.getUser().uniqueKey, this.token.getBranchId(), this.currentFile).subscribe({
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





