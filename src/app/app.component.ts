import { Component } from '@angular/core';
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


  // displayVal = 'none';
  colorVal = 'yellow';

  titleImg = 'assets/testimg/IMG_7122.JPG';
  displayVal = 'block';

  public event: boolean;

  constructor() {

    this.event = false;

  }


  


  open02(){
    this.displayVal = 'none';
    this.titleImg = 'assets/testimg/IMG_7121.JPG';
    this.displayVal = 'block';
    

  }
  open03(){
    this.displayVal = 'none';
    this.titleImg = 'assets/testimg/IMG_7120.JPG'
    this.displayVal = 'block';
  }
  
}



