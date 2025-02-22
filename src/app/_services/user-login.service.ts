import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_model/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {


  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {

    return this.http.get<any>("/users/login/getAll", { params });


  }

}
