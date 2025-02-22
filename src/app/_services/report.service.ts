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
export class ReportService {
  constructor(private http: HttpClient) { }

  getAllCurrent(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/findAll/inventory/" + uniqueKey + "/" + branchId, { params });

  }

  getAllCurrentBrand(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>("/report/findAll/inventory/brand/" + uniqueKey, { params });

  }

  getAllSales(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/findAll/sales/" + uniqueKey + "/" + branchId, { params });

  }

  getAllSalesBrand(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>("/report/findAll/sales/brand/" + uniqueKey, { params });

  }
}
