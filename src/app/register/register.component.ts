import { Component, OnInit } from '@angular/core';
import {AuthorizeService} from '../_service/authorize.service';
import {TokenService} from '../_service/token.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(64),
      Validators.email
    ]),
  });

  isLogged = false;
  isRegisterFailed = false;
  errorMessage = '';

  constructor(private authService: AuthorizeService, private tokenStorage: TokenService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLogged = true;
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.authService
        .register(this.form)
        .subscribe(data => {
            window.location.href = '/login';
          },
          err => {
            this.errorMessage = JSON.parse(err.error)["message"];
            this.isRegisterFailed = true;
          });
    }
  }
  public hasError = (controlName: string, errName: string) => {
    return this.form.controls[controlName].hasError(errName);
  }

}
