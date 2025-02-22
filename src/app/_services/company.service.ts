import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Company } from '../_model/company';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getById(id: String): Observable<Company> {

    return this.http.get<Company>("/company/getById/" + id, { responseType: 'json' });


  }
  getByUniqueKey(uniqueKey: String): Observable<Company> {

    return this.http.get<Company>("/company/getByUniqueKey/" + uniqueKey, { responseType: 'json' });


  }
  update(uniqueKey: String, id: String, company: Company): Observable<any> {
    return this.http.put('/company/update/' + uniqueKey + '/' + id, company, { responseType: 'json' });

  }

  uploadImageLogo(uniqueKey: string, id: string, file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('id', id);
    formData.append('uniqueKey', uniqueKey);


    return this.http.post<any>("/company/update/logo/" + uniqueKey + "/" + id, formData, { responseType: 'json' });
  }

  findAll(): Observable<any> {
    return this.http.get<any>("/company/findAll", {
      responseType: 'json',
    });
  }
  getAll(params: any): Observable<any> {

    return this.http.get<any>("/company/getAll", { params });


  }
  delete(id: any): Observable<any> {
    return this.http.delete<any>("/company/delete/" + id, { responseType: 'json' });
  }
}
