import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MustMatch } from '../list/list.component';
import { UserService } from '../../../../_services/user.service';
import { User } from '../../../../_model/user';
import { Province } from '../../../../_model/province';
import { District } from '../../../../_model/district';
import { AddressService } from '../../../../_services/address.service';
import { UserInfoService } from '../../../../_services/user-info.service';
import { UserInfo } from '../../../../_model/user-info';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {


  userProfileForm: FormGroup;
  passwordForm!: FormGroup;



  getUser: User;
  user: User;


  getProvince: Province[];
  getDistrict: District[];

  getDistrictById: District;
  getProvinceByPid: Province;

  getUserInfo: UserInfo;
  userInfo: UserInfo;
  infoForm!: FormGroup;
  get fInfo() {
    return this.infoForm.controls;
  }

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
    private userService: UserService,
    private userInfoService: UserInfoService,
    private addressService: AddressService,
  ) { }

  ngOnInit(): void {

    this.userProfileForm = this.formBuilder.group({

      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });


    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9_.]+$/)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.infoForm = this.formBuilder.group({

      birthday: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      zipcode: ['', Validators.required],
    });

    this.addressService.getProvince().subscribe(data => {
      this.getProvince = data;
    });

    this.retrieveUser();


  }

  retrieveUser() {
    this.loadingBar.show();
    this.route.params.subscribe(params => {
      this.userService.getById(params['id']).subscribe(data => {
        this.getUser = data;

        this.userProfileForm.patchValue({ email: this.getUser.email });
        this.userProfileForm.patchValue({ name: this.getUser.name });
        this.userProfileForm.patchValue({ phone: this.getUser.phone });
        this.userProfileForm.controls['email'].disable();

        this.retrieveUserInfo(this.getUser.id);
        this.loadingBar.hide();
        //  console.log(this.getUser);
      });

    });
  }

  retrieveUserInfo(id: string) {
    this.loadingBar.show();

    this.userInfoService.findOne(id).subscribe(data => {
      if (!data) {
        return;
      }

      this.getUserInfo = data;

      this.addressService.getProvinceByPid(this.getUserInfo.province.pid).subscribe(data => {
        this.getProvinceByPid = data;
      });
      this.addressService.getDistrictById(this.getUserInfo.district.id).subscribe(data => {
        this.getDistrictById = data;
      });

      this.addressService.getDistrict(this.getUserInfo.province.pid).subscribe(data => {
        this.getDistrict = data;
      });

      this.infoForm.patchValue({ birthday: this.getUserInfo.birthdayDate });
      this.infoForm.patchValue({ phone: this.getUserInfo.phone });
      this.infoForm.patchValue({ address: this.getUserInfo.address });
      this.infoForm.patchValue({ district: this.getUserInfo.district.id });
      this.infoForm.patchValue({ province: this.getUserInfo.province.pid });
      this.infoForm.patchValue({ zipcode: this.getUserInfo.zipcode });

      this.loadingBar.hide();
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
  onBack() {
    this.router.navigate(["/admin/brand/user/list"]);
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
  onChangeInfo() {
    if (this.infoForm.invalid) {
      return;
    }

    this.loadingBar.show();
    this.userInfo = new UserInfo();


    this.userInfo.birthday = this.fInfo['birthday'].value.day + "/" + this.fInfo['birthday'].value.month + "/" + this.fInfo['birthday'].value.year;
    this.userInfo.birthdayDate = this.fInfo['birthday'].value;
    this.userInfo.phone = this.fInfo['phone'].value;
    this.userInfo.address = this.fInfo['address'].value;
    this.userInfo.province = this.getProvinceByPid;
    this.userInfo.district = this.getDistrictById;
    this.userInfo.zipcode = this.fInfo['zipcode'].value;
    this.userInfo.userId = this.getUser.id;

    this.userInfoService.update(this.getUser.id, this.userInfo).subscribe(
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



  onDelete(id: any) {

    Swal.fire({
      title: 'ลบข้อมูลผู้ใช้งานระบบ?',
      text: "คุณต้องกาลบข้อมูลผู้ใช้งานระบบ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#999999',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {

        this.loadingBar.show();

        this.userService.delete(id)
          .subscribe({
            next: (data) => {


              if (data.message == "Successfully!") {
                this.loadingBar.hide();

                Swal.fire({
                  icon: 'success',
                  title: 'ลบข้อมูลสำเร็จ',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.router.navigate(["/admin/brand/user/list"]);
                });

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
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
