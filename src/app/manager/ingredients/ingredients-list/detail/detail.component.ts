import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Ingredients } from '../../../../_model/ingredients';
import { IngredientsCategory } from '../../../../_model/ingredients-category';
import { IngredientsHistory } from '../../../../_model/ingredients-history';
import { Menu } from '../../../../_model/menu';
import { IngredientsCategoryService } from '../../../../_services/ingredients-category.service';
import { IngredientsService } from '../../../../_services/ingredients.service';
import { StorageService } from '../../../../_services/storage.service';
import { MenuService } from '../../../../_services/menu.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  ingredients: Ingredients;

  imageToShow: any = 'assets/img/choose.png';


  getCategory: IngredientsCategory[] = [];

  getCategoryById: IngredientsCategory;

  url: any = '';
  sum: number = 0

  getIngredients: Ingredients;

  getIngredientsHistory: IngredientsHistory[] = [];

  getMenu: Menu[] = [];

  constructor(
    private router: Router,
    private categoryService: IngredientsCategoryService,
    private ingredientsService: IngredientsService,
    private token: StorageService,
    private formBuilder: FormBuilder,
    private manuService: MenuService,
    private loadingBar: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {

    this.retrieveMenu();
    this.retrieveCategory();
    this.retrieveIngredients();
    this.retrieveIngredientsHistor();
  }
  retrieveMenu() {

    this.loadingBar.show();

    this.manuService.findAll(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {

          this.getMenu = data;

          console.log(data)


          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  retrieveIngredientsHistor() {

    this.loadingBar.show();
    this.route.params.subscribe(params => {
      this.ingredientsService.getAllHistory(this.token.getUser().uniqueKey, this.token.getBranchId(), params['id'])
        .subscribe({
          next: (data) => {

            this.getIngredientsHistory = data;
            this.sum = this.getIngredientsHistory.reduce((acc: any, cur: any) => acc + cur.useAmount, 0);

            this.loadingBar.hide();
          },
          error: (err) => {
            console.log(err);

          }
        });
    });
  }

  retrieveIngredients() {
    this.route.params.subscribe(params => {
      this.ingredientsService.getById(this.token.getUser().uniqueKey, params['id']).subscribe(data => {
        this.getIngredients = data;




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



  onBack() {
    this.router.navigate(["/manager/ingredients/ingredients-list/list"]);
  }
}
