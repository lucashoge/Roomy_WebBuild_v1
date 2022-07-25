import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import * as kf from './keyframes';




@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => match', animate('1000ms ease-in-out', keyframes(kf.match))),
    ])
  ]
  
})
export class MainUiComponent {

  loggedInUser: any;
  toggleMatchAnimation: boolean = false;

  parentSubject:Subject<string> = new Subject();

  startAnimation(state: any) {
    console.log(state)
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState(state: any) {
    console.log("resetAnimationState")
    this.animationState = '';
  }

  animationState!: string;


  constructor(private http: HttpClient, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);

    this.startAnimation("match");
  }

  cardAnimation(value: any) {

      this.parentSubject.next(value);
  }

  openSettings(){
    this.router.navigate(['/settings'])

  }

  openChat(){
    this.router.navigate(['/chat'])

  }

  matchFoundEvent(event: any){
    console.log("matchFoundEvent toggled!")
    if(event.match == true){
      this.toggleMatchAnimation = true;
      this.startAnimation("match");
    }else{
      this.toggleMatchAnimation = false;
    }
    
  }

}
