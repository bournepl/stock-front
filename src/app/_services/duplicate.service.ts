import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Branch } from '../_model/branch';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class DuplicateService {

  constructor(private http: HttpClient) { }

  create(admin: String, data: any): Observable<any> {

    return this.http.post<any>("/duplicate/create/" + admin, data, httpOptions);
  }
  createIn(admin: String, data: any): Observable<any> {

    return this.http.post<any>("/duplicate/create/ingredients/" + admin, data, httpOptions);
  }


  createMenu(admin: String, data: any): Observable<any> {

    return this.http.post<any>("/duplicate/create/menu/" + admin, data, httpOptions);
  }
}
