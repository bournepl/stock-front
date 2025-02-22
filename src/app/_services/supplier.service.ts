import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SupplierService {


  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {

    return this.http.get<any>("/supplier/getAll/" + uniqueKey + "/" + branchId, { params });


  }

  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/supplier/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }



  create(uniqueKey: String, supplier: any): Observable<any> {
    return this.http.post<any>('/supplier/create/' + uniqueKey, supplier, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>('/supplier/delete/' + id, { responseType: 'json' });
  }
  findById(uniqueKey: String, id: string): Observable<any> {

    return this.http.get<any>('/supplier/findById/' + uniqueKey + "/" + id, { responseType: 'json' });


  }
  update(uniqueKey: String, id: String, supplier: any): Observable<any> {
    return this.http.put<any>('/supplier/update/' + uniqueKey + "/" + id, supplier, httpOptions);
  }

}
