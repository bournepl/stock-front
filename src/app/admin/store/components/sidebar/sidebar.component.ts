import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../../_services/branch.service';
import { StorageService } from '../../../../_services/storage.service';
import { Branch } from '../../../../_model/branch';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/brand/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/admin/brand/branch', title: 'Branch', icon: 'add_home', class: '' },
  { path: '/admin/brand/duplicate', title: 'Duplicate', icon: 'file_copy', class: '' },
  { path: '/admin/brand/user', title: 'ผู้ใช้งานระบบ', icon: 'person', class: '' },


];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  getBranchById: Branch;

  constructor(
    private branchService: BranchService,
    private token: StorageService,
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.getBranch();
  }

  getBranch() {

    this.branchService.get(this.token.getUser().uniqueKey, this.token.getBranchId())
      .subscribe({
        next: (data) => {
          this.getBranchById = data;
        },
        error: (e) => console.error(e)
      });

  }


  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };


}
