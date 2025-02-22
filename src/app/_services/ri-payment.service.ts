import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RiPayment } from '../_model/riPayment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RiPaymentService {


  constructor(private http: HttpClient) { }


  create(prDetail: RiPayment): Observable<any> {
    return this.http.post<any>('/riPayment/create', prDetail, httpOptions);
  }

  findById(uniqueKey: String, branchId: String, id: string): Observable<RiPayment> {

    return this.http.get<RiPayment>('/riPayment/findById/' + uniqueKey + "/" + branchId + "/" + id, { responseType: 'json' });

  }

  update(id: String, riDetail: RiPayment): Observable<any> {
    return this.http.put<any>('/riPayment/update/' + id, riDetail, httpOptions);
  }

  getAllById(uniqueKey: String, branchId: String, id: String): Observable<RiPayment[]> {
    return this.http.get<RiPayment[]>('/riPayment/getAllById/' + uniqueKey + "/" + branchId + "/" + id, {
      responseType: 'json',
    });
  }
}
