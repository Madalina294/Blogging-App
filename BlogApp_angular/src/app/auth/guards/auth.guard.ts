import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (StorageService.isAdminLoggedIn()) {
      this.router.navigateByUrl('/admin/view-all');
      return false;
    } else if (StorageService.isCustomerLoggedIn()) {
      this.router.navigateByUrl('/user/view-all');
      return false;
    }
    return true; // Permite accesul la login/signup dacă nu este logat
  }
}
