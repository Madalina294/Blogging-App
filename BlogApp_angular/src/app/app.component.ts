import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {StorageService} from './auth/services/storage/storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatButton, RouterLink, MatIconButton, MatIcon, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BlogApp_angular';
  isAdminLoggedIn: boolean = false;
  isCustomerLoggedIn: boolean = false;
  userName: string | null = null;

  constructor(private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(){
    this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
    this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn();
    this.userName = StorageService.getUserName();
    this.router.events.subscribe(event => {
      if(event.constructor.name === "NavigationEnd"){
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
        this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn();
        this.userName = StorageService.getUserName();
      }
    })
  }

  shareSite() {
    const currentUrl = window.location.href;
    
    // try use Web Share API 
    if (navigator.share) {
      navigator.share({
        title: 'Blog App',
        text: 'Check out this blog app!',
        url: currentUrl
      }).then(() => {
        this.snackBar.open('Link shared successfully!', 'OK', { duration: 3000 });
      }).catch((error) => {
        console.log('Eroare la partajare:', error);
        this.copyToClipboard(currentUrl);
      });
    } else {
      // Fallback: copy URL-ul in clipboard
      this.copyToClipboard(currentUrl);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Link copied in clipboard!', 'OK', { duration: 3000 });
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.snackBar.open('Link copied in clipboard!', 'OK', { duration: 3000 });
    });
  }

  logout() {
    StorageService.signout();
    this.router.navigateByUrl("/login");
  }
}
