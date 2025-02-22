import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DashboardBrandService {

  constructor(private http: HttpClient) { }

  findAll(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>('/dashboard/brand/findAll/inventory/' + uniqueKey, { params });
  }
  findAllChart1(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>('/dashboard/brand/findAll/waste/chart/month/' + uniqueKey, { params });
  }

  findAllChart2(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>('/dashboard/brand/findAll/waste/chart/year/' + uniqueKey, { params });
  }

  findAllChart3(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>('/dashboard/brand/findAll/purchase/chart/month/' + uniqueKey, { params });
  }

  findAllChart4(uniqueKey: String, params: any): Observable<any> {
    return this.http.get<any>('/dashboard/brand/findAll/purchase/chart/year/' + uniqueKey, { params });
  }
}
