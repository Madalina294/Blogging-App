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

  createComment(postId: number, content: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('postId', postId.toString());
    params.set('content', content);

    return this.http.post(BASE_URL + `api/user/comment`, params, {
      headers: this.createAuthorizationHeader().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  searchPosts(searchTerm: string): Observable<any>{
    return this.http.get(BASE_URL + `api/user/post/search/${searchTerm}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getCommentsByPostId(postId: number): Observable<any>{
    return this.http.get(BASE_URL + `api/user/post/${postId}/comments`, {
      headers: this.createAuthorizationHeader()
    });
  }

  deletePost(postId: number): Observable<any>{
    return this.http.delete(BASE_URL + `api/user/post/delete/${postId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getMyPosts(userId: number): Observable<any>{
    return this.http.get(BASE_URL + `api/user/my-posts/${userId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  updateProfile(userId: number, formData: any): Observable<any>{
    return this.http.put(BASE_URL + `api/user/update-profile/${userId}`, formData, {
      headers: this.createAuthorizationHeader()
    });
  }


  createAuthorizationHeader(): HttpHeaders{
    const token = StorageService.getToken();
    if (!token) {
      console.error('No token found in storage');
      return new HttpHeaders();
    }
    
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }
}
