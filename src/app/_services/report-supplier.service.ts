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
export class ReportSupplierService {
  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/supplier/findAll/" + uniqueKey + "/" + branchId, { params });

  }
  getAllBrand(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>("/report/supplier/findAll/brand/" + uniqueKey, { params });

  }

}
