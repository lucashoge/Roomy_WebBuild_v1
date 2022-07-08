import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import { Subject } from 'rxjs';


@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.css'],
  
})
export class MainUiComponent {

  
  


  

  parentSubject:Subject<string> = new Subject();

  constructor() {

  }

 cardAnimation(value: any) {
    this.parentSubject.next(value);
  }


  


 

}
