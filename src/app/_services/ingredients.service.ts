import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  constructor(private http: HttpClient) { }



  getAll(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/ingredients/getAll/' + uniqueKey + "/" + branchId, { params });
  }

  findAll(uniqueKey: String, branchId: String): Observable<any> {
    return this.http.get<any>('/ingredients/findAll/' + uniqueKey + "/" + branchId, {
      responseType: 'json',
    });
  }


  getById(uniqueKey: String, id: String): Observable<any> {
    return this.http.get<any>('/ingredients/getById/' + uniqueKey + '/' + id, {
      responseType: 'json',
    });
  }

  create(uniqueKey: String, data: any): Observable<any> {
    return this.http.post<any>(
      '/ingredients/create/' + uniqueKey,
      data,
      httpOptions
    );
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>('/ingredients/delete/' + id, {
      responseType: 'json',
    });
  }

  update(uniqueKey: String, id: String, data: any): Observable<any> {
    return this.http.put<any>(
      '/ingredients/update/' + uniqueKey + '/' + id,
      data,
      httpOptions
    );
  }


  getLast(uniqueKey: String, branchId: String, categoryId: any): Observable<any> {
    return this.http.get<any>('/ingredients/getLast/' + uniqueKey + "/" + branchId + "/" + categoryId, {
      responseType: 'json',
    });
  }


  getByBarcode(uniqueKey: String, id: String): Observable<any> {
    return this.http.get<any>('https://api.inventoryhero.page/api/ingredients/getByBarcode/' + uniqueKey + '/' + id, {
      responseType: 'json',
    });
  }
  uploadImage(uniqueKey: string, id: string, file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('id', id);


    return this.http.post<any>("/ingredients/update/image/" + uniqueKey + "/" + id, formData, { responseType: 'json' });
  }

  getAllByPr(uniqueKey: String, branchId: String, params: any): Observable<any> {
    return this.http.get<any>('/ingredients/getAllByPr/' + uniqueKey + "/" + branchId, { params });
  }


  getAllHistory(uniqueKey: String, branchId: String, id: String): Observable<any> {
    return this.http.get<any>('/ingredients/findAll/history/' + uniqueKey + "/" + branchId + "/" + id,);
  }

}
