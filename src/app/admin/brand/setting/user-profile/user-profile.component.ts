import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { User } from '../../../../_model/user';
import { UserService } from '../../../../_services/user.service';
import { StorageService } from '../../../../_services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userProfileForm: FormGroup;
  passwordForm!: FormGroup;



  getUser: User;

  user: User;

  get f() {
    return this.userProfileForm.controls;
  }

  get fPass() {
    return this.passwordForm.controls;
  }

  constructor(
    private router: Router,

    private formBuilder: FormBuilder,
    private loadingBar: NgxSpinnerService,
    private route: ActivatedRoute,
    private token: StorageService,
    private userService: UserService,

  ) { }

  ngOnInit(): void {

    this.userProfileForm = this.formBuilder.group({

      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],

    });


    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9_.]+$/)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });


    this.retrieveUser();


  }

  retrieveUser() {

    this.userService.get(this.token.getUser().username)
      .subscribe({
        next: (res) => {
          this.getUser = res;

          this.userProfileForm.patchValue({ name: this.getUser.name });
          this.userProfileForm.patchValue({ phone: this.getUser.phone });
          this.userProfileForm.patchValue({ email: this.getUser.email });

          this.userProfileForm.controls['email'].disable();


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


  onChangePassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.loadingBar.show();
    this.user = new User();

    this.user.password = this.fPass['password'].value;


    this.userService.updatePassword(this.getUser.id, this.user).subscribe(
      data => {

        if (data.message == "Successfully!") {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {

            this.retrieveUser();
          })
        }

      },
      error => {
        this.loadingBar.hide();
        //  console.log(error);

        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: error.message,
        })
      }
    );
  }

  onUpdateUser() {
    if (this.userProfileForm.invalid) {
      return;
    }

    console.log(this.userProfileForm.value);

    this.loadingBar.show();

    this.user = new User();

    this.user.name = this.f['name'].value;
    this.user.phone = this.f['phone'].value;

    this.userService.update(this.getUser.id, this.user).subscribe(
      data => {


        if (data.message == "Successfully!") {
          this.loadingBar.hide();

          Swal.fire({
            icon: 'success',
            title: 'แก้ไขข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {

            this.retrieveUser();
          })



        }


      },
      error => {
        this.loadingBar.hide();

        Swal.fire({
          icon: "warning",
          title: 'Oops...',
          text: error.message,
        })
      }
    );
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

