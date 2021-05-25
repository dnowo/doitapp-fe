import { Component, OnInit } from '@angular/core';
import {User, UserService} from '../_service/user.service';
import {TokenService} from '../_service/token.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLogged: boolean;
  date: any;

  // tslint:disable-next-line:new-parens
  user: User = new class implements User {
    username: string;
    email: string;
  };

  constructor(private userService: UserService, private tokenService: TokenService, private jwtHelper: JwtHelperService){}

  ngOnInit(): void {
    if (this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
      this.logout();
    } else {
      this.isLogged = true;
      this.getTokenExpirationDate();
      this.getUserData();
    }
  }

  private getUserData(): void{
    this.userService.getUserData()
      .subscribe(u => {
        this.user = u;
      }, error => {
        if (error.status === 401) {
          this.logout();
        }
      });
  }

  private getTokenExpirationDate(): void {
    const token = this.tokenService.getToken();
    const decodedToken = this.jwtHelper.decodeToken(token);

    if (decodedToken.exp === undefined) { return null; }

    this.date = new Date(0);
    this.date.setUTCSeconds(decodedToken.exp);
  }

  logout(): void {
    this.tokenService.logout();
    this.isLogged = false;
    window.location.href = '/login';
  }

}

