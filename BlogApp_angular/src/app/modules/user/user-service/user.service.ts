import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StorageService} from '../../../auth/services/storage/storage.service';

const BASE_URL = "http://localhost:8080/"
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient ) { }

  createNewPost(data:any): Observable<any> {
    return this.http.post(BASE_URL + `api/user/post`, data,  {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllPosts(): Observable<any>{
    return this.http.get(BASE_URL + `api/user/all-posts`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getPostById(postId: number): Observable<any>{
    return this.http.get(BASE_URL + `api/user/post/${postId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  likePost(postId: number): Observable<any>{
    return this.http.put(BASE_URL + `api/user/post/like/${postId}`, {}, {
      headers: this.createAuthorizationHeader()
    });
  }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders();
    const token = StorageService.getToken();
    console.log('Token from storage:', token);
    if (!token) {
      console.error('No token found in storage');
      return authHeaders;
    }
    const authHeader = 'Bearer ' + token;
    console.log('Authorization header:', authHeader);
    return authHeaders.set('Authorization', authHeader);
  }
}
