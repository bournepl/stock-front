import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  findAll(uniqueKey: String, branchId: String,): Observable<any> {
    return this.http.get<any>('/dashboard/findAll/inventory/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }
  findAllChart1(uniqueKey: String, branchId: String,): Observable<any> {
    return this.http.get<any>('/dashboard/findAll/waste/chart/month/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }

  findAllChart2(uniqueKey: String, branchId: String,): Observable<any> {
    return this.http.get<any>('/dashboard/findAll/waste/chart/year/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }

  findAllChart3(uniqueKey: String, branchId: String,): Observable<any> {
    return this.http.get<any>('/dashboard/findAll/purchase/chart/month/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }

  findAllChart4(uniqueKey: String, branchId: String,): Observable<any> {
    return this.http.get<any>('/dashboard/findAll/purchase/chart/year/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }
}
