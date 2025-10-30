import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private http : HttpClient) { }

  signup(signupRequest: any): Observable<any>{
    return this.http.post(environment.apiUrl + "/api/auth/signup", signupRequest);
  }
  login(loginRequest: any): Observable<any>{
    return this.http.post(environment.apiUrl + "/api/auth/login", loginRequest);
  }
}
