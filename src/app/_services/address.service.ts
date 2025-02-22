import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { District } from '../_model/district';
import { Province } from '../_model/province';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AddressService {


  constructor(private http: HttpClient) { }


  getProvince(): Observable<Province[]> {

    return this.http.get<District[]>("/address/province", { responseType: 'json' });


  }
  getProvinceByPid(pid: string): Observable<Province> {

    return this.http.get<Province>("/address/province/" + pid, { responseType: 'json' });


  }
  getDistrict(name: string): Observable<District[]> {


    return this.http.get<District[]>("/address/district/" + name, { responseType: 'json' });

  }
  getDistrictById(id: string): Observable<District> {


    return this.http.get<District>("/address/getDistrictById/" + id, { responseType: 'json' });

  }


}
