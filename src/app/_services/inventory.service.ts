import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) { }



  getAllPurchase(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/inventory/findAll/purchase/" + uniqueKey + "/" + branchId, { params });

  }
  getAllCurrent(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/inventory/findAll/current/" + uniqueKey + "/" + branchId, { params });

  }

  getAllBom(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/inventory/findAll/bom/" + uniqueKey + "/" + branchId, { params });

  }

  getAllLast(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/inventory/findAll/last/" + uniqueKey + "/" + branchId, { params });

  }


  getAllUse(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/inventory/findAll/use/" + uniqueKey + "/" + branchId, { params });

  }

  getAllWaste(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>("/inventory/findAll/waste/" + uniqueKey + "/" + branchId, { params });

  }
}
