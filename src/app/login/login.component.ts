import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthorizeService} from '../_service/authorize.service';
import {TokenService} from '../_service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(32)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
  });

  isLogged = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthorizeService, private tokenStorage: TokenService) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLogged = true;
      // this.roles = this.tokenStorage.getUser().roles;
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.authService
        .login(this.form)
        .subscribe(data => {
            this.tokenStorage.setToken(data);
            // this.tokenStorage.setUser(data);

            this.isLoginFailed = false;
            this.isLogged = true;
            // this.roles = this.tokenStorage.getUser().roles;
            window.location.href = '/home';
          },
          err => {
            if (err.status === 401) {
              this.errorMessage = 'Wrong username or password!';
            }
            this.isLoginFailed = true;
            this.isLogged = false;
          });
    }
  }
    public hasError = (controlName: string, errName: string) => {
      return this.form.controls[controlName].hasError(errName);
    }
}
