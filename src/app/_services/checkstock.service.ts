import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetail } from '../_model/orderDetail';
import { Observable } from 'rxjs';
import { CheckStock } from '../_model/check-stock';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CheckStockService {
  constructor(private http: HttpClient) { }

  create(data: CheckStock): Observable<any> {
    return this.http.post<any>('/checkstock/create', data, httpOptions);
  }

  update(data: CheckStock): Observable<any> {
    return this.http.post<any>('/checkstock/update', data, httpOptions);
  }
  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/checkstock/findAll/" + uniqueKey + "/" + branchId, { params });

  }

  getAllNonCheck(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/checkstock/findAll/nonCheck/" + uniqueKey + "/" + branchId, { params });

  }
}
