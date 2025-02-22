import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PoDetail } from '../_model/poDetail';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PoService {


  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/po/getAll/' + uniqueKey + "/" + branchId, { params });
  }

  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/po/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }
  create(uniqueKey: String, prDetail: PoDetail): Observable<any> {
    return this.http.post<any>('/po/create/' + uniqueKey, prDetail, httpOptions);
  }

  findById(id: string): Observable<PoDetail> {

    return this.http.get<PoDetail>('/po/findById/' + id, { responseType: 'json' });

  }

  approved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/po/update/approved/' + uniqueKey + "/" + id, httpOptions);
  }

  unapproved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/po/update/unapproved/' + uniqueKey + "/" + id, httpOptions);
  }


  findPoByPoId(uniqueKey: String, id: string): Observable<PoDetail> {

    return this.http.get<PoDetail>('/po/findPoByPoId/' + uniqueKey + "/" + id, { responseType: 'json' });

  }

  update(uniqueKey: String, id: String, poDetail: PoDetail): Observable<any> {
    return this.http.put<any>('/po/update/' + uniqueKey + "/" + id, poDetail, httpOptions);
  }

  getAllByRi(uniqueKey: string, branchId: string): Observable<PoDetail[]> {
    return this.http.get<PoDetail[]>('/po/getAllByRi/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }

  updateProductRemove(uniqueKey: string, id: String, uuid: String, poDetail: PoDetail): Observable<any> {
    return this.http.put<any>('/po/update/product/remove/' + uniqueKey + "/" + id + "/" + uuid, poDetail, httpOptions);
  }

  updateProduct(uniqueKey: string, id: String, poDetail: PoDetail): Observable<any> {
    return this.http.put<any>('/po/update/product/' + uniqueKey + "/" + id, poDetail, httpOptions);
  }

  updateSupplier(uniqueKey: String, id: String, supplierId: String,): Observable<any> {
    return this.http.put<any>('/po/update/supplier/' + uniqueKey + "/" + id + "/" + supplierId, httpOptions);
  }

  cancel(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/po/update/cancel/' + uniqueKey + "/" + id, httpOptions);
  }


}
