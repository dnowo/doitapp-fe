import { Injectable } from '@angular/core';

const TOKEN_KEYWORD = 'auth-token';
const USER = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  logout(): void{
    window.sessionStorage.clear();
  }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEYWORD);
    window.sessionStorage.setItem(TOKEN_KEYWORD, token);
  }

  public getToken(): string {
    return window.sessionStorage.getItem(TOKEN_KEYWORD);
  }

  public setUser(user: any): void {
    window.sessionStorage.removeItem(USER);
    window.sessionStorage.setItem(USER, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER));
  }
}
