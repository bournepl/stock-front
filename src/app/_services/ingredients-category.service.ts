import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class IngredientsCategoryService {
  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/ingredientsCategory/getAll/' + uniqueKey + "/" + branchId, { params });
  }

  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/ingredientsCategory/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }

  getById(uniqueKey: String, id: String): Observable<any> {
    return this.http.get<any>('/ingredientsCategory/getById/' + uniqueKey + '/' + id, {
      responseType: 'json',
    });
  }

  create(uniqueKey: String, data: any): Observable<any> {
    return this.http.post<any>(
      '/ingredientsCategory/create/' + uniqueKey,
      data,
      httpOptions
    );
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>('/ingredientsCategory/delete/' + id, {
      responseType: 'json',
    });
  }

  update(uniqueKey: String, id: String, data: any): Observable<any> {
    return this.http.put<any>(
      '/ingredientsCategory/update/' + uniqueKey + '/' + id,
      data,
      httpOptions
    );
  }
}
