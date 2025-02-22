import { Injectable } from '@angular/core';
import { Remember } from '../_model/remember';

const R_KEY = 'zocklip-remember-me';

@Injectable({
  providedIn: 'root'
})
export class RememberService {

  constructor() { }

  clean(): void {
    window.localStorage.clear();
  }

  public saveRememberMe(user: Remember): void {
    window.localStorage.removeItem(R_KEY);
    window.localStorage.setItem(R_KEY, JSON.stringify(user));
  }


  public getRememberMe(): any {
    const user = window.localStorage.getItem(R_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isRememberMe(): boolean {
    const user = window.localStorage.getItem(R_KEY);
    if (user) {
      return true;
    }

    return false;
  }


}
