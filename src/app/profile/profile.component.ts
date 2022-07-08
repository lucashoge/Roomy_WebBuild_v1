import { Component, OnInit, Input } from '@angular/core';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import * as kf from './keyframes';
import {User} from './user';
import data from './users.json';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate('900ms ease-in-out', keyframes(kf.swiperight))),
      transition('* => swipeleft', animate('900ms ease-in-out', keyframes(kf.swipeleft)))
    ])
  ]
})
export class ProfileComponent {

  public users: User[] = data;
  currentUser!: User;


  public index = -1;
  switch = false;
  @Input()
  parentSubject!: Subject<any>;

  



  animationState!: string;
  constructor() {
   }

  ngOnInit() {
    this.parentSubject.subscribe(event => {
      this.startAnimation(event)
    });
    this.currentUser = this.users[0];
  }

  startAnimation(state: any) {
    if (!this.animationState) {
      this.animationState = state;
    }
    
  }

  resetAnimationState(state: any) {
    this.animationState = '';
    if(this.switch == true){
      this.index++;
      console.log(this.index);
      this.currentUser = this.users[this.index];
      this.switch = false
    }else{
      this.switch = true;
    }

    
    
    // this.index++;
    // console.log(state);
    // this.currentUser = this.users[this.index];
  }




  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }

}
