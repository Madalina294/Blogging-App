import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../user-service/user.service';
import {StorageService} from '../../../../auth/services/storage/storage.service';
import {MatIcon} from '@angular/material/icon';
import {UpdateProfileComponent} from '../update-profile/update-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

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
    MatCardSubtitle,
    MatIcon
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
  username: string = "";
  numberOfPosts: number = 0;
  posts: any = [];
  numberOfLikes: number = 0;
  numberOfViews: number = 0;

  constructor(private snackBar: MatSnackBar,
              private userService: UserService,
              private dialog: MatDialog) {
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
        for(var post of this.posts){
          this.numberOfLikes += post.likeCount;
          this.numberOfViews += post.viewCount;
        }
        console.log(this.numberOfViews);
      })
    }
  }

  openUpdateProfileDialog() {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reîncarcă informațiile utilizatorului
        this.getUserInfo();
      }
    });
  }

  deletePost(postId: number){
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this post? This action cannot be undone.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deletePost(postId).subscribe((res)=>{
          this.snackBar.open("Post deleted successfully!", "Ok");
          this.getUserInfo();
        }, error => {
          this.snackBar.open("Something went wrong!", "Ok", {duration: 3000})
        })
      }
    });
  }
}
