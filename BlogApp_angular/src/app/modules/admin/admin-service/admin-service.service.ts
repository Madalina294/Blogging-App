import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StorageService} from '../../../auth/services/storage/storage.service';

const BASE_URL = "http://localhost:8080/"
@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http: HttpClient ) { }

  getAllPosts(): Observable<any>{
    return this.http.get(BASE_URL + `api/admin/all-posts`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getPostById(postId: number): Observable<any>{
    return this.http.get(BASE_URL + `api/admin/post/${postId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getCommentsByPostId(postId: number): Observable<any>{
    return this.http.get(BASE_URL + `api/admin/post/${postId}/comments`, {
      headers: this.createAuthorizationHeader()
    });
  }

  createComment(postId: number, content: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('postId', postId.toString());
    params.set('content', content);

    return this.http.post(BASE_URL + `api/admin/comment`, params, {
      headers: this.createAuthorizationHeader().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer '+ StorageService.getToken()
    );
  }
}
