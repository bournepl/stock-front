import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  constructor(private http: HttpClient) { }


  getAllPurchase(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/findAll/purchase/" + uniqueKey + "/" + branchId, { params });

  }
  getAllCurrent(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/findAll/current/" + uniqueKey + "/" + branchId, { params });

  }
  getAllBom(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/findAll/bom/" + uniqueKey + "/" + branchId, { params });

  }

  getAllUse(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/findAll/use/" + uniqueKey + "/" + branchId, { params });

  }
  getAllWaste(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/report/summary/findAll/waste/" + uniqueKey + "/" + branchId, { params });

  }
}
