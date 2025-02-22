import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Remember } from '../_model/remember';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../_model/loginRequest';
import { Subscription } from 'rxjs';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { RememberService } from '../_services/remember.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  data: Date = new Date();
  focus: any;
  focus1: any;



  isRememberMe: boolean = false;
  rememberMe: Remember;

  loginForm!: FormGroup;
  roles: string[] = [];
  private loginInfo!: LoginRequest;
  isLoggedIn = false;
  eventBusSub?: Subscription;

  password: string = 'password';
  show = false;
  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private rememberService: RememberService,
    private loadingBar: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)

    });

    this.isRememberMe = this.rememberService.isRememberMe();
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.roles = this.storageService.getUser().roles;

    if (this.isLoggedIn) {
      this.roles.every(role => {
        if (role === 'ROLE_BRAND') {
          this.router.navigate(['/admin']);

        } else if (role === 'ROLE_HOST') {
          this.router.navigate(['/super-admin']);

        } else if (role === 'ROLE_STAFF') {
          this.router.navigate(['/staff']);

        } else if (role === 'ROLE_MANAGER') {
          this.router.navigate(['/manager']);

        } else if (role === 'ROLE_OWNER') {
          this.router.navigate(['/manager']);
        }
      });
    }
    if (this.isRememberMe) {
      this.loginForm.patchValue({ username: this.rememberService.getRememberMe().username });
      this.loginForm.patchValue({ password: this.rememberService.getRememberMe().password });
    }
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });


  }

  selectRememberMe(isSelected: any,) {
    if (isSelected.target.checked == true) {
      this.isRememberMe = true;
    }
    else {
      this.isRememberMe = false;
    }
  }

  onSubmit(): void {


    this.loadingBar.show();
    this.loginInfo = new LoginRequest(
      this.f['username'].value,
      this.f['password'].value);

    this.authService.login(this.loginInfo).subscribe(
      data => {
        this.storageService.saveUser(data);




        if (this.isRememberMe == true) {

          this.rememberMe = new Remember();
          this.rememberMe.username = this.f['username'].value;
          this.rememberMe.password = this.f['password'].value;

          this.rememberService.saveRememberMe(this.rememberMe)

        } else {
          this.rememberService.clean();
        }

        if (data.branchId) {
          this.storageService.saveBranchId(data.branchId);
        }

        this.reloadPage();
      },
      error => {


        if (error.status == 401) {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'error',
            title: 'Warning!',
            confirmButtonColor: '#07cdae',
            text: "Username หรือ Password ไม่ถูกต้อง"

          })
        }

      });

  }
  reloadPage(): void {
    window.location.reload();
  }

  onLogin() {
    this.router.navigate(['/admin']);
  }


  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean();
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
}

