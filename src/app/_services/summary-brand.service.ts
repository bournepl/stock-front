import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class SummaryBrandService {
  constructor(private http: HttpClient) { }


  getAllPurchase(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/brand/findAll/purchase/" + uniqueKey, { params });

  }
  getAllCurrent(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/brand/findAll/current/" + uniqueKey, { params });

  }
  getAllBom(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/brand/findAll/bom/" + uniqueKey, { params });

  }

  getAllUse(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/brand/findAll/use/" + uniqueKey, { params });

  }
  getAllWaste(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/brand/findAll/waste/" + uniqueKey, { params });

  }
}
