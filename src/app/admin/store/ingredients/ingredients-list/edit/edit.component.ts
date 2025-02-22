import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Ingredients } from '../../../../../_model/ingredients';
import { IngredientsCategory } from '../../../../../_model/ingredients-category';
import { IngredientsCategoryService } from '../../../../../_services/ingredients-category.service';
import { IngredientsService } from '../../../../../_services/ingredients.service';
import { StorageService } from '../../../../../_services/storage.service';
import Swal from 'sweetalert2';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  ingredients: Ingredients;

  imageToShow: any = 'assets/img/choose.png';
  dataForm: FormGroup;

  getCategory: IngredientsCategory[] = [];

  getCategoryById: IngredientsCategory;

  selectedFiles: FileList;
  fileName: string;

  url: any = '';
  currentFileUpload: File;

  dropdownList: any = [];
  dropdownSettings: any = {};

  getIngredients: Ingredients;

  selectedPurchaseUnit: any = [];
  selectedStockUnit: any = [];
  selectedUseUnit: any = [];

  get f() {
    return this.dataForm.controls;
  }
  constructor(
    private router: Router,
    private categoryService: IngredientsCategoryService,
    private ingredientsService: IngredientsService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {

    this.dropdownList = [
      { "id": 1, "itemName": "กระป๋อง" },
      { "id": 2, "itemName": "กระปุก" },
      { "id": 3, "itemName": "กรัม" },
      { "id": 4, "itemName": "ก้อน" },
      { "id": 5, "itemName": "กล่อง" },
      { "id": 6, "itemName": "กิโลกรัม" },
      { "id": 7, "itemName": "ขวด" },
      { "id": 8, "itemName": "ชิ้น" },
      { "id": 9, "itemName": "ห่อ" },
      { "id": 10, "itemName": "หลอด" },
      { "id": 11, "itemName": "ช้อนชา" },
      { "id": 12, "itemName": "ช้อนโต๊ะ" },
      { "id": 13, "itemName": "ถุง" },
      { "id": 14, "itemName": "ถัง" },
      { "id": 15, "itemName": "ถ้วย" },
      { "id": 16, "itemName": "ปอนด์" },
      { "id": 17, "itemName": "มิลลิกรัม" },
      { "id": 18, "itemName": "มิลลิลิตร" },
      { "id": 19, "itemName": "ลิตร" },
      { "id": 20, "itemName": "ออนซ์" },
      { "id": 21, "itemName": "แกลลอน" },
      { "id": 22, "itemName": "แพ็ค" },
      { "id": 23, "itemName": "แผง" },
      { "id": 24, "itemName": "ซอง" },
      { "id": 25, "itemName": "หัว" },
      { "id": 26, "itemName": "ใบ" },
      { "id": 27, "itemName": "ชุด" },
      { "id": 28, "itemName": "แผ่น" },
      { "id": 29, "itemName": "ลัง" },
      { "id": 30, "itemName": "ไม้" },
      { "id": 31, "itemName": "ฟอง" },
    ];
    this.dropdownSettings = {
      singleSelection: true,
      enableSearchFilter: true,
      text: '',
      classes: "myclass custom-class",
      labelKey: "itemName",
      searchBy: ['itemName']
    };




    this.dataForm = this.formBuilder.group({
      category: ['', Validators.required],
      ingredientName: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]],
      purchaseUnit: ['', Validators.required],
      stockAmount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]],
      stockUnit: ['', Validators.required],
      useUnit: ['', Validators.required],
      useAmount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]],
      safetyStockMax: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      safetyStockMin: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      leadtime: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      average: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      description: [''],
      barcode: [''],
    });

    this.retrieveCategory();
    this.retrieveIngredients();
  }

  retrieveIngredients() {
    this.route.params.subscribe(params => {
      this.ingredientsService.getById(this.token.getUser().uniqueKey, params['id']).subscribe(data => {
        this.getIngredients = data;


        this.dataForm.patchValue({ category: this.getIngredients.category.id });
        this.dataForm.patchValue({ ingredientName: this.getIngredients.ingredientName });
        this.dataForm.patchValue({ ingredientId: this.getIngredients.ingredientId });
        this.dataForm.patchValue({ stockAmount: this.getIngredients.stockAmount });
        this.dataForm.patchValue({ price: this.getIngredients.price });
        this.dataForm.patchValue({ brand: this.getIngredients.brand });
        this.dataForm.patchValue({ safetyStockMax: this.getIngredients.safetyStockMax });
        this.dataForm.patchValue({ safetyStockMin: this.getIngredients.safetyStockMin });
        this.dataForm.patchValue({ maxStock: this.getIngredients.maxStock });
        this.dataForm.patchValue({ leadtime: this.getIngredients.leadtime });
        this.dataForm.patchValue({ description: this.getIngredients.description });
        this.dataForm.patchValue({ useAmount: this.getIngredients.useAmount });
        this.dataForm.patchValue({ average: this.getIngredients.average });

        this.selectedPurchaseUnit = this.dropdownList.filter(data => data.itemName == this.getIngredients.purchaseUnit);
        this.selectedStockUnit = this.dropdownList.filter(data => data.itemName == this.getIngredients.stockUnit);
        this.selectedUseUnit = this.dropdownList.filter(data => data.itemName == this.getIngredients.useUnit);

        this.dataForm.patchValue({ purchaseUnit: this.selectedPurchaseUnit });
        this.dataForm.patchValue({ stockUnit: this.selectedStockUnit });
        this.dataForm.patchValue({ useUnit: this.selectedUseUnit });

        if (this.getIngredients.imageUrl == "" || this.getIngredients.imageUrl == null) {
          this.imageToShow = "assets/img/choose.png";

        } else {
          this.imageToShow = this.getIngredients.imageUrl;
        }

        this.getCategoryById = this.getIngredients.category;


        this.loadingBar.hide();

      });

    });
  }

  retrieveCategory() {

    this.loadingBar.show();
    this.categoryService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {
          this.getCategory = data;
          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  onChangeCategory(event: any) {
    this.loadingBar.show();
    if (event.value != undefined) {
      this.categoryService.getById(this.token.getUser().uniqueKey, event.value).subscribe({
        next: (data) => {
          this.getCategoryById = data;

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }


  create() {

    if (this.dataForm.invalid) {

      return;
    }

    this.ingredients = new Ingredients();

    this.ingredients.category = this.getCategoryById;
    this.ingredients.description = this.f['description'].value;
    this.ingredients.ingredientName = this.f['ingredientName'].value;
    this.ingredients.price = this.f['price'].value;
    this.ingredients.purchaseUnit = this.f['purchaseUnit'].value[0].itemName;

    this.ingredients.stockAmount = this.f['stockAmount'].value;
    this.ingredients.stockUnit = this.f['stockUnit'].value[0].itemName;

    this.ingredients.useAmount = this.f['useAmount'].value;
    this.ingredients.useUnit = this.f['useUnit'].value[0].itemName;

    this.ingredients.average = this.f['average'].value;
    this.ingredients.barCodeNumber = this.f['barcode'].value;
    this.ingredients.brand = this.f['brand'].value;

    this.ingredients.safetyStockMax = this.f['safetyStockMax'].value;
    this.ingredients.safetyStockMin = this.f['safetyStockMin'].value;


    this.ingredients.leadtime = this.f['leadtime'].value;

    this.ingredients.uniqueKey = this.token.getUser().uniqueKey;
    this.ingredients.branchId = this.token.getBranchId();

    if (this.selectedFiles == undefined) {
      this.ingredientsService.update(this.token.getUser().uniqueKey, this.getIngredients.id, this.ingredients)
        .subscribe({
          next: (res) => {
            if (res.message == "Successfully!") {
              this.loadingBar.hide();
              if (res.message == 'Successfully!') {
                this.loadingBar.hide();
                Swal.fire({
                  icon: 'success',
                  title: 'แก้ไขวัตถุดิบสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {

                  this.retrieveIngredients();
                })
              }
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


    } else {
      this.loadingBar.show();
      this.currentFileUpload = this.selectedFiles.item(0)!;
      this.ingredientsService.update(this.token.getUser().uniqueKey, this.getIngredients.id, this.ingredients)
        .subscribe({
          next: (res) => {

            if (res.message == "Successfully!") {

              this.ingredientsService
                .uploadImage(
                  this.token.getUser().uniqueKey,
                  this.getIngredients.uniqueId,
                  this.currentFileUpload
                )
                .subscribe({
                  next: (res: any) => {
                    this.loadingBar.hide();
                    if (res.message == 'Successfully!') {
                      this.loadingBar.hide();
                      Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขวัตถุดิบสำเร็จ',
                        showConfirmButton: false,
                        timer: 1500
                      }).then(() => {

                        this.retrieveIngredients();
                      })
                    }
                  },
                  error: (error) => {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Oops...',
                      text: error.message,
                    });
                  },
                });


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


  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)!.size > 1024000) {
      Swal.fire({
        icon: 'warning',
        title: 'ไฟล์ภาพมีขนาดใหณ่เกินไป! (ไม่เกิน 1 M)',
        confirmButtonColor: '#07cdae',
      });
      this.selectedFiles = undefined!;
    } else {
      if (this.selectedFiles && this.selectedFiles.item(0)) {
        this.fileName = this.selectedFiles.item(0)!.name;
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFiles.item(0)!); // read file as data url
        reader.onload = (event) => {
          // called once readAsDataURL is completed
          this.url = reader.result!.toString();
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
    }
  }

  public deleteImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileName = '';
    this.url = '';
    this.selectedFiles = undefined!;
  }

  onBack() {
    this.router.navigate(["/admin/store/ingredients/ingredients-list/list"]);
  }
}

