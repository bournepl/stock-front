import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/menu/getAll/' + uniqueKey + "/" + branchId, { params });
  }
  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/menu/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }

  getById(uniqueKey: String, id: String): Observable<any> {
    return this.http.get<any>('/menu/getById/' + uniqueKey + '/' + id, {
      responseType: 'json',
    });
  }

  create(uniqueKey: String, data: any): Observable<any> {
    return this.http.post<any>(
      '/menu/create/' + uniqueKey,
      data,
      httpOptions
    );
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>('/menu/delete/' + id, {
      responseType: 'json',
    });
  }

  update(uniqueKey: String, id: String, data: any): Observable<any> {
    return this.http.put<any>(
      '/menu/update/' + uniqueKey + '/' + id,
      data,
      httpOptions
    );
  }

  updateStatus(uniqueKey: String, id: String, data: any): Observable<any> {
    return this.http.put<any>(
      '/menu/update/status/' + uniqueKey + '/' + id,
      data,
      httpOptions
    );
  }

  getLast(uniqueKey: String, branchId: String, categoryId: any): Observable<any> {
    return this.http.get<any>('/menu/getLast/' + uniqueKey + "/" + branchId + "/" + categoryId, {
      responseType: 'json',
    });
  }

  findAllByCategoryId(uniqueKey: String, branchId: String, categoryId: string): Observable<any> {
    return this.http.get<any>('/menu/findAllByCategoryId/' + uniqueKey + "/" + branchId + "/" + categoryId, {
      responseType: 'json',
    });
  }

  findAllByDelivery(uniqueKey: String, branchId: String, channelId: string): Observable<any> {
    return this.http.get<any>('/menu/findAllByDelivery/' + uniqueKey + "/" + branchId + "/" + channelId, {
      responseType: 'json',
    });
  }

}
