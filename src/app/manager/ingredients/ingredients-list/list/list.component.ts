import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';
import { Ingredients } from '../../../../_model/ingredients';
import { IngredientsCategory } from '../../../../_model/ingredients-category';
import { IngredientsService } from '../../../../_services/ingredients.service';
import { StorageService } from '../../../../_services/storage.service';
import { IngredientsCategoryService } from '../../../../_services/ingredients-category.service';
import { ExcelService } from '../../../../_services/excel.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  focus: any;
  focus1: any;

  search = '';
  page = 1;
  pageSize = 10;
  count = 0;
  categoryId = '';

  responseMessage: any;
  errorMessage: any;

  getIngredients: Ingredients[] = [];


  fileInfos?: Observable<any>;



  getCategory: IngredientsCategory[] = [];

  imageToShow: any = "assets/img/noimage.png";

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileName: string;
  @ViewChild('staticModalImport', { static: false }) staticModalImport: ModalDirective;

  fileNameExport = 'IngredientSheet.xlsx';

  constructor(
    private router: Router,
    private token: StorageService,
    private ingredientsService: IngredientsService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private categoryService: IngredientsCategoryService,
    private excelService: ExcelService

  ) {

  }

  ngOnInit(): void {

    this.retrieveCategory();

  }


  retrieveCategory() {

    this.loadingBar.show();
    this.categoryService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId(),)
      .subscribe({
        next: (data) => {
          this.getCategory = data;
          this.retrieveIngredient();

        },
        error: (err) => {
          console.log(err);

        }
      });
  }


  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveIngredient();
  }
  retrieveIngredient() {

    this.loadingBar.show();

    const params = this.getRequestParams(this.search, this.categoryId, this.page, this.pageSize);

    this.ingredientsService.getAll(this.token.getUser().uniqueKey, this.token.getBranchId(), params)
      .subscribe({
        next: (data) => {
          const { result, totalItems } = data;
          this.getIngredients = result;
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


  onInformation(id: any) {
    this.router.navigate(["/manager/ingredients/ingredients-list/edit", id]);
  }

  onDetail(id: any) {
    this.router.navigate(["/manager/ingredients/ingredients-list/detail", id]);
  }

  onDelete(customerId: string) {

    Swal.fire({
      title: 'ลบข้อมูลวัตถุดิบ?',
      text: "คุณต้องการลบข้อมูลวัตถุดิบนี้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingBar.show();
        this.ingredientsService.delete(customerId).subscribe(
          reponse => {

            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'ลบข้อมูลวัตถุดิบสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.retrieveIngredient();

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
  onAdd() {
    this.router.navigate(['/manager/ingredients/ingredients-list/add']);
  }

  onChange(event: any) {

    if (event.target.value == "") {
      this.categoryId = "";
      this.retrieveIngredient();
    } else {
      this.categoryId = event.target.value;
      this.retrieveIngredient();

    }

  }


  onKeyUp(event: any) {
    this.search = event.target.value;
    this.page = 1;
    this.retrieveIngredient();
  }

  onPageChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveIngredient();
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

        this.excelService.uploadIngredients(this.token.getUser().uniqueKey, this.token.getBranchId(), this.currentFile).subscribe({
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

