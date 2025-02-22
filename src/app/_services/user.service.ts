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
export class UserService {


  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {

    return this.http.get<any>("/users/getAll", { params });


  }
  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/users/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }



  get(username: String): Observable<any> {

    return this.http.get<any>("/users/get/" + username, { responseType: 'json' });

  }

  update(id: String, info: any): Observable<any> {
    return this.http.put('/users/update/' + id, info, { responseType: 'json' });

  }


  updatePassword(id: String, info: any): Observable<any> {
    return this.http.put('/users/updateById/password/' + id, info, { responseType: 'json' });

  }


  create(data: any): Observable<any> {

    return this.http.post<any>("/users/create", data, httpOptions);
  }


  delete(id: any): Observable<any> {
    return this.http.delete<any>("/users/delete/" + id, { responseType: 'json' });
  }

  getById(id: String): Observable<any> {

    return this.http.get<any>("/users/getById/" + id, { responseType: 'json' });

  }
  signup(data: any): Observable<any> {

    return this.http.post<any>("/users/signup", data, httpOptions);
  }


  getAllSuperAdmin(params: any): Observable<any> {

    return this.http.get<any>("/users/getAll/super/admin", { params });


  }

  signupAdmin(data: any): Observable<any> {

    return this.http.post<any>("/users/signup/super/admin", data, httpOptions);
  }


  getAllByUniqueKey(uniqueKey: String, params: any): Observable<any> {

    return this.http.get<any>("/users/getAllByUniqueKey/" + uniqueKey, { params });


  }

  getAllStaffByUniqueKey(uniqueKey: String, branchId: String, params: any): Observable<any> {

    return this.http.get<any>("/users/getAllStaffByUniqueKey/" + uniqueKey + "/" + branchId, { params });


  }
}
