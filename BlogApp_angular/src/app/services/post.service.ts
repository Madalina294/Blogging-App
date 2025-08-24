import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const BASE_URL = "http://localhost:8080/"
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient ) { }

  createNewPost(data:any): Observable<any> {
    return this.http.post(BASE_URL + `api/posts`, data);
  }

  getAllPosts(): Observable<any>{
    return this.http.get(BASE_URL + `api/posts`);
  }
}
