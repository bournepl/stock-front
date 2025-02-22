import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RiDetail } from '../_model/riDetail';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RiService {


  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/ri/getAll/' + uniqueKey + "/" + branchId, { params });
  }

  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/ri/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }
  getAllByPo(uniqueKey: String): Observable<RiDetail[]> {
    return this.http.get<RiDetail[]>('/ri/getAllByPo/' + uniqueKey, {
      responseType: 'json',
    });
  }
  create(uniqueKey: String, prDetail: RiDetail): Observable<any> {
    return this.http.post<any>('/ri/create/' + uniqueKey, prDetail, httpOptions);
  }

  findById(id: string): Observable<RiDetail> {

    return this.http.get<RiDetail>('/ri/findById/' + id, { responseType: 'json' });

  }

  approved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/ri/update/approved/' + uniqueKey + "/" + id, httpOptions);
  }

  unapproved(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/ri/update/unapproved/' + uniqueKey + "/" + id, httpOptions);
  }


  findPrByPrId(uniqueKey: String, id: string): Observable<RiDetail> {

    return this.http.get<RiDetail>('/ri/findPrByPrId/' + uniqueKey + "/" + id, { responseType: 'json' });

  }

  update(uniqueKey: String, id: String, riDetail: RiDetail): Observable<any> {
    return this.http.put<any>('/ri/update/' + uniqueKey + "/" + id, riDetail, httpOptions);
  }

  cancel(uniqueKey: String, id: String): Observable<any> {
    return this.http.put<any>('/ri/update/cancel/' + uniqueKey + "/" + id, httpOptions);
  }

}
