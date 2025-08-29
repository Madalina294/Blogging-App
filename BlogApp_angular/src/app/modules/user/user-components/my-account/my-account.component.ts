import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../user-service/user.service';
import {StorageService} from '../../../../auth/services/storage/storage.service';

@Component({
  selector: 'app-my-account',
  imports: [
    NgForOf,
    MatCardHeader,
    MatCardActions,
    MatCard,
    MatButton,
    NgIf,
    RouterLink,
    MatCardTitle,
    MatCardSubtitle
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
  username: string = "";
  numberOfPosts: number = 0;
  posts: any = [];

  constructor(private snackBar: MatSnackBar,
              private userService: UserService) {
  }

  ngOnInit(){
    this.getUserInfo();
  }

  getUserInfo(){
    this.username = StorageService.getUserName();
    const userId = parseInt(StorageService.getUserId());
    if(userId !== -1){
      this.userService.getMyPosts(userId).subscribe((res)=>{
        this.posts = res;
        console.log(res);
        this.numberOfPosts = this.posts.length;
      })
    }
  }

}
