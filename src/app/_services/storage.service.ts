import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const Branch_KEY = 'branch-id';

@Injectable({
  providedIn: 'root'
})
export class StorageService {



  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }


  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public saveBranchId(branchId: string): void {
    window.sessionStorage.removeItem(Branch_KEY);
    window.sessionStorage.setItem(Branch_KEY, branchId);
  }
  public getBranchId(): any {
    return window.sessionStorage.getItem(Branch_KEY);
  }

}
