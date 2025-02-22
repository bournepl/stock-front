import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { CheckStock } from '../_model/check-stock';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class BrandDashboardService {


  constructor(private http: HttpClient) { }

  getByProvince(id: string): Observable<any> {

    return this.http.get<any>("/brandDashboard/getByProvince/" + id, { responseType: 'json' });


  }

  getAll(): Observable<any> {

    return this.http.get<any>("/brandDashboard/getAll", { responseType: 'json' });


  }
}
