import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Branch } from '../_model/branch';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class BranchService {

  constructor(private http: HttpClient) { }

  getAll(uniqueKey: String, params: any): Observable<any> {

    return this.http.get<any>("/branch/getAll/" + uniqueKey, { params });


  }

  findAll(uniqueKey: String): Observable<any> {
    return this.http.get<any>('/branch/findAll/' + uniqueKey, {
      responseType: 'json',
    });
  }


  get(uniqueKey: String, id: String): Observable<Branch> {

    return this.http.get<Branch>("/branch/getById/" + uniqueKey + '/' + id, { responseType: 'json' });

  }


  update(uniqueKey: String, id: String, info: Branch): Observable<any> {
    return this.http.put<any>('/branch/update/' + uniqueKey + "/" + id, info, httpOptions);

  }

  create(uniqueKey: String, data: any): Observable<any> {

    return this.http.post<any>("/branch/create/" + uniqueKey, data, httpOptions);
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>("/branch/delete/" + id, { responseType: 'json' });
  }



  findAllBranch(): Observable<any> {
    return this.http.get<any>('/branch/findAll', {
      responseType: 'json',
    });
  }

}
