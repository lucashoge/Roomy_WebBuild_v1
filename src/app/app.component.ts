import { Component } from '@angular/core';
import { AuthService } from './auth.service';
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
  styleUrls: ['./app.component.css'],
  // animations: [
  //   trigger('fadeIn', [
  //     transition(':enter', [
  //       style({opacity: 0}),
  //       animate('1000ms', style({opacity: 1}))

  //     ])

  //   ])
  // ]

  // animations: [
  //   state('')
  // ]
  
  

})
export class AppComponent {
  title = 'my-new-angular-app';


  
  constructor( public auth: AuthService) { }
}



