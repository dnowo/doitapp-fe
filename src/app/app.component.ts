import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {TokenService} from './_service/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'DoItApp';
  userLogged;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.userLogged = !!this.tokenService.getToken();
  }
}

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  transform(val: string, params: string[]): string[] {
    return val.split(params[0]);
  }
}

