import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetail } from '../_model/orderDetail';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) { }

  create(orderDetail: OrderDetail): Observable<any> {
    return this.http.post<any>('/order/create', orderDetail, httpOptions);
  }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/order/getAll/' + uniqueKey + "/" + branchId, { params });
  }

  getById(id: String): Observable<any> {
    return this.http.get<any>('/order/getById/' + id, {
      responseType: 'json',
    });
  }
  approved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/order/update/approved/' + uniqueKey + "/" + id, httpOptions);
  }

}
