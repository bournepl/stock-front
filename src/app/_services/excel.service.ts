import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(private http: HttpClient) { }


  uploadIngredientsCategory(uniqueKey: string, branchId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/ingredientsCategory/" + uniqueKey + "/" + branchId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadIngredients(uniqueKey: string, branchId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/ingredients/" + uniqueKey + "/" + branchId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }



  uploadMenuCategory(uniqueKey: string, branchId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/menuCategory/" + uniqueKey + "/" + branchId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadMenu(uniqueKey: string, branchId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/menu/" + uniqueKey + "/" + branchId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }


  uploadImportIng(uniqueKey: string, branchId: string, menuId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/import/" + uniqueKey + "/" + branchId + "/" + menuId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadImportIngPackage(uniqueKey: string, branchId: string, menuId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/import/package/" + uniqueKey + "/" + branchId + "/" + menuId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }



  uploadImportMenu(uniqueKey: string, branchId: string, orderId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', "/import/excel/upload/import/menu/" + uniqueKey + "/" + branchId + "/" + orderId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
