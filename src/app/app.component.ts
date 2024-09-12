import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject} from 'rxjs';

import { 
  style,
  trigger,
  state,
  animate,
  transition, 
} from '@angular/animations';
import { ForwardRefHandling } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  title = 'my-new-angular-app';


  constructor( public auth: AuthService) {
  }
}



