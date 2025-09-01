import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../user/user-service/user.service';
import {MatDialog} from '@angular/material/dialog';
import {StorageService} from '../../../../auth/services/storage/storage.service';
import {AdminServiceService} from '../../admin-service/admin-service.service';
import {UpdateProfileComponent} from '../../../user/user-components/update-profile/update-profile.component';

@Component({
  selector: 'app-admin-panel',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  username: string = "";
  numberOfPosts: number = 0;
  posts: any = [];
  numberOfLikes: number = 0;
  numberOfViews: number = 0;

  constructor(private snackBar: MatSnackBar,
              private adminService: AdminServiceService,
              private dialog: MatDialog) {
  }

  ngOnInit(){
    this.getAdminName();
    this.getGlobalInfo();
  }

  getAdminName(){
    this.username = StorageService.getUserName();
  }

  getGlobalInfo(){
    this.adminService.getAllPosts().subscribe((res)=>{
      this.posts = res;
      this.numberOfPosts = res.length;
      
      // Reset counters before calculating
      this.numberOfLikes = 0;
      this.numberOfViews = 0;
      
      // Calculate totals with correct property names
      for(let post of this.posts){
        this.numberOfLikes += post.likeCount || 0;
        this.numberOfViews += post.viewCount || 0;
      }
    })
  }

  openUpdateProfileDialog() {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAdminName();
        this.getGlobalInfo();
      }
    });
  }
}
