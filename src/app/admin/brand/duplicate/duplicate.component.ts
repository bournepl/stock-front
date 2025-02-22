import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { BranchService } from '../../../_services/branch.service';
import { StorageService } from '../../../_services/storage.service';
import { Branch } from '../../../_model/branch';
import { DuplicateService } from '../../../_services/duplicate.service';
import { Duplicate } from '../../../_model/duplicate';

@Component({
  selector: 'app-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss']
})
export class DuplicateComponent {

  focus: any;
  focus1: any;


  dropdownSettings: any = {};
  dropdownSettings2: any = {};
  title = '';
  category = '';
  page = 1;
  pageSize = 9;
  count = 0;

  getBranch: Branch[] = [];
  branchId1: string;
  branchId2: string;
  duplicate: Duplicate;

  duplicateForm: FormGroup;

  get f() {
    return this.duplicateForm.controls;
  }

  constructor(
    private router: Router,
    private loadingBar: NgxSpinnerService,
    private branchService: BranchService,
    private duplicateService: DuplicateService,
    private token: StorageService,
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit() {

    this.duplicateForm = this.formBuilder.group({
      branch1: ['', Validators.required],
      branch2: ['', Validators.required],

    });

    this.dropdownSettings = {
      singleSelection: true,
      enableSearchFilter: true,
      text: '',
      labelKey: "branchName",
      searchBy: ['branchName']
    };
    this.dropdownSettings2 = {
      singleSelection: true,
      labelKey: "branchName",
      searchBy: ['branchName'],
      enableSearchFilter: true
    };
    this.retrieveBranch();
  }
  retrieveBranch(): void {

    this.branchService.findAll(this.token.getUser().uniqueKey)
      .subscribe({
        next: (data) => {

          this.getBranch = data;
          console.log(this.getBranch)

          this.loadingBar.hide();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  onItemSelect(event: any) {
    this.branchId1 = event.target.value;

  }
  onItemSelect2(event: any) {
    this.branchId2 = event.target.value;
  }

  onConfirm() {

    if (this.branchId1 == this.branchId2) {
      Swal.fire({
        icon: "warning",
        title: 'กรุณาเลือกสาขาที่ไม่ซ้ำกัน',
        confirmButtonColor: '#07cdae',

      })

      return;
    }

    this.duplicate = new Duplicate();

    this.duplicate.uniqueKey = this.token.getUser().uniqueKey;
    this.duplicate.branch1 = this.branchId1;
    this.duplicate.branch2 = this.branchId2;

    this.loadingBar.show();
    this.duplicateService.create(this.token.getUser().uniqueKey, this.duplicate)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {

            this.onConfirmIn(this.duplicate);

          }

        },
        error: (error) => {
          this.loadingBar.hide();
          if (error.status == 400) {
            Swal.fire({
              icon: "warning",
              title: 'Duplicate สาขานี้แล้ว',
              confirmButtonColor: '#07cdae',

            })
          }

        }
      });

  }

  onConfirmIn(duplicate: Duplicate) {
    this.duplicateService.createIn(this.token.getUser().uniqueKey, duplicate)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {


            this.onConfirmMenu(this.duplicate);
          }

        },
        error: (error) => {
          console.log(error);

        }
      });
  }

  onConfirmMenu(duplicate: Duplicate) {
    this.duplicateService.createMenu(this.token.getUser().uniqueKey, duplicate)
      .subscribe({
        next: (res) => {

          if (res.message == "Successfully!") {
            this.loadingBar.hide();
            Swal.fire({
              icon: 'success',
              title: 'คัดลอกข้อมูล',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {

              this.retrieveBranch();
            })

          }

        },
        error: (error) => {
          console.log(error);

        }
      });
  }
}
