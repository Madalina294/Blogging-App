import { Injectable } from '@angular/core';

const TOKEN = "token";
const USER = "user";

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  static saveToken(token: string): void{
    if (!this.isBrowser()) return;
    console.log('Saving token to localStorage:', token);
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
    console.log('Token saved successfully');
  }

  static saveUser(user: any): void{
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string | null{
    if (!this.isBrowser()) return null;
    const token = window.localStorage.getItem(TOKEN);
    console.log('Retrieved token from localStorage:', token);
    return token;
  }

  static getUser(): any{
    if (!this.isBrowser()) return null;
    const rawUser = window.localStorage.getItem(USER);
    if (!rawUser) return null;
    try{
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }

  static getUserRole() : string{
    const user = this.getUser();
    if(user == null) return '';
    return user.role;
  }

  static isAdminLoggedIn(): boolean{
    if (!this.isBrowser()) return false;
    if(this.getToken() === null) return false;
    const role:string = this.getUserRole();
    return role === "ADMIN";
  }

  static isCustomerLoggedIn(): boolean{
    if (!this.isBrowser()) return false;
    if(this.getToken() == null) return false;
    const role:string = this.getUserRole();
    return role === "USER";
  }

  static hasToken(): boolean{
    if(this.getToken() == null) return false;
    else return true;
  }

  static getUserId(): string{
    if (!this.isBrowser()) return '';
    const user = this.getUser();
    if(user === null) return "";
    else return user.id;
  }

  static getUserName(): string{
    if (!this.isBrowser()) return '';

    const user = this.getUser();
    if(user === null) return "";

    // Return username if available
    if(user.name) return user.name;
    if(user.username) return user.username;

    return "User"; // Fallback
  }


  static signout(): void{
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem(TOKEN);
  }

  static updateUserProfile(updatedUser: any): void {
    if (!this.isBrowser()) return;
    
    // Obține utilizatorul curent
    const currentUser = this.getUser();
    if (!currentUser) return;
    
    // Actualizează doar câmpurile furnizate, păstrează restul
    const updatedUserData = {
      ...currentUser,
      name: updatedUser.name || currentUser.name,
      email: updatedUser.email || currentUser.email,
      // Păstrează ID-ul și rolul original
      id: currentUser.id,
      role: currentUser.role
    };
    
    // Salvează utilizatorul actualizat
    this.saveUser(updatedUserData);
    console.log('User profile updated in storage:', updatedUserData);
  }

  static updateUserProfileWithToken(updatedUser: any, newToken?: string): void {
    if (!this.isBrowser()) return;
    
    // Actualizează profilul utilizatorului
    this.updateUserProfile(updatedUser);
    
    // Actualizează token-ul dacă este furnizat
    if (newToken) {
      this.saveToken(newToken);
      console.log('Token updated in storage:', newToken);
    }
  }

  static getUserEmail(): string {
    if (!this.isBrowser()) return '';
    const user = this.getUser();
    if (user === null) return '';
    return user.email || '';
  }
}
