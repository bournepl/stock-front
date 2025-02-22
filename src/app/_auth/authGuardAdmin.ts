import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { StorageService } from '../_services/storage.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {

  roles: string[] = [];
  constructor(
    public storageService: StorageService,
    public router: Router
  ) { }
  canActivate(

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.roles = this.storageService.getUser().roles;

    if (this.storageService.isLoggedIn() !== true) {

      Swal.fire({
        icon: 'error',
        title: 'ไม่อนุญาตให้เข้าถึง!',
        confirmButtonColor: '#07cdae',
        text: "กรุณาล็อกอินเพื่อเข้าสู่ระบบ"

      })
      this.router.navigate(['login'])

    } else if (this.storageService.isLoggedIn() === true) {

      this.roles.forEach(role => {
        if (role !== 'ROLE_ADMIN') {
          Swal.fire({
            icon: 'error',
            title: 'ไม่อนุญาตให้เข้าถึง!',
            confirmButtonColor: '#07cdae',
            text: "สิทธิ์ของคุณไม่สามารถเข้าถึงได้"

          })
          this.router.navigate(['login'])
        }
      })


    }




    return true;
  }
}
