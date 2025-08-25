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
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void{
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string | null{
    if (!this.isBrowser()) return null;
    return window.localStorage.getItem(TOKEN);
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

    // Return user name if available
    if(user.name) return user.name;
    if(user.username) return user.username;

    return "User"; // Fallback
  }

  static signout(): void{
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem(TOKEN);
  }
}
