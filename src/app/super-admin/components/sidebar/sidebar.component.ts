import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { StorageService } from '../../../_services/storage.service';
import { User } from '../../../_model/user';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [

  { path: '/super-admin/brand', title: 'Brand', icon: 'add_home', class: '' },

  { path: '/super-admin/user', title: 'ผู้ใช้งานระบบ', icon: 'person', class: '' },


];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isLoggedIn: boolean = false;
  constructor(
    private token: StorageService,
    private userService: UserService
  ) { }

  getUser: User;

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.isLoggedIn = this.token.isLoggedIn();
    if (this.isLoggedIn) {
      this.userService.get(this.token.getUser().username).subscribe(
        data => {
          this.getUser = data;


        }
      );
    }
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };
}
