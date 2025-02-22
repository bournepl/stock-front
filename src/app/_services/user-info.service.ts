import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private http: HttpClient) { }

  findOne(userId: String,): Observable<any> {
    return this.http.get<any>('/users/info/findOne/' + userId, {
      responseType: 'json',
    });
  }

  update(id: String, info: any): Observable<any> {
    return this.http.put('/users/info/update/' + id, info, { responseType: 'json' });

  }




}
