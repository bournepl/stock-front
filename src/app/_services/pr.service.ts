import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrDetail } from '../_model/prDetail';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PrService {


  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/pr/getAll/' + uniqueKey + "/" + branchId, { params });
  }

  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/pr/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }
  getAllByPo(uniqueKey: string, branchId: string): Observable<PrDetail[]> {
    return this.http.get<PrDetail[]>('/pr/getAllByPo/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }
  create(uniqueKey: String, prDetail: PrDetail): Observable<any> {
    return this.http.post<any>('/pr/create/' + uniqueKey, prDetail, httpOptions);
  }

  findById(id: string): Observable<PrDetail> {

    return this.http.get<PrDetail>('/pr/findById/' + id, { responseType: 'json' });

  }

  approved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/pr/update/approved/' + uniqueKey + "/" + id, httpOptions);
  }

  unapproved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/pr/update/unapproved/' + uniqueKey + "/" + id, httpOptions);
  }


  findPrByPrId(uniqueKey: String, id: string): Observable<PrDetail> {

    return this.http.get<PrDetail>('/pr/findPrByPrId/' + uniqueKey + "/" + id, { responseType: 'json' });

  }

  cancel(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/pr/update/cancel/' + uniqueKey + "/" + id, httpOptions);
  }


}
