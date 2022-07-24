import { Component, OnInit, Input } from '@angular/core';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import * as kf from './keyframes';
import {User} from './user';
import data from './users.json';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { HandleTokenErrorService } from '../handle-token-error.service';

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

  public users: any[] = [];// = data;
  currentUser!: any;
  userID = 0;
  loggedInUser: any;


  public index = -1;
  switch = false;
  @Input()
  parentSubject!: Subject<any>;

  noMoreProfilesToBrowse: boolean = false;

  
  animationState!: string;

  constructor(private http: HttpClient, private router: Router, private handleToken: HandleTokenErrorService) {
   }

  ngOnInit() {
    this.parentSubject.subscribe(event => {
      this.startAnimation(event)
    });
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);

    console.log("profileComp loggedInUser: " + this.loggedInUser)

    this.getNewUsersForMatching();  
  }

  startAnimation(state: any) {
    console.log(state)
    if (!this.animationState) {
      this.animationState = state;
    }

    
    if(state=="swiperight"){

      this.http.post<any>("submitMatch", { body: {idToMatch: this.currentUser.userid, usertype: this.loggedInUser.usertype, matchValue: 1} }).subscribe((result) => {
        console.log(result);
      });
    }else{
      this.http.post<any>("submitMatch", { body: {idToMatch: this.currentUser.userid, usertype: this.loggedInUser.usertype, matchValue: 0} }).subscribe((result) => {
        console.log(result);
      },
      err => {
        console.log("Error");
        if (err instanceof HttpErrorResponse) {
                    if(err.status==401){
            this.handleToken.handleTokenError();
          } 
        }
      });
    }  
  }

  resetAnimationState(state: any) {
    this.animationState = '';
    if(this.switch == true){
      this.index++;
      if(this.index>=this.users.length){
        this.index = 0;
        this.getNewUsersForMatching();
      }else{
        this.currentUser = this.users[this.index]; 
      }
      this.switch = false
    }else{
      this.switch = true;
    }

    
    
    // this.index++;
    // console.log(state);
    // this.currentUser = this.users[this.index];
  }

  async getNewUsersForMatching() {
    var httpPostData = {minUserId: this.userID, usertype: this.loggedInUser.usertype, limit: "3"};
    this.http.post<any>("getUsersFromIdUpwards", { body: httpPostData}).subscribe((result) => {
      
      this.users = result;
      console.log("getNewUsersForMatching result:");
      console.log(this.users);
      if(this.users.length > 0){
        this.currentUser = this.users[0]; 
        console.log("currentUser from profiles" + this.currentUser)
        console.log(this.currentUser)
        this.userID = this.users[this.users.length-1].userid;
        if(this.currentUser.profilepic == ''){
          this.currentUser.profilepic = 'assets/Profilbild_default.jpg'
        }
        console.log("profilePicture: " + this.currentUser.profilepic)
      }else{
        this.noMoreProfilesToBrowse = true;
        this.currentUser = null;
      }
      
    },
    err => {
      console.log("Error");
      if (err instanceof HttpErrorResponse) {
                  if(err.status==401){
            this.handleToken.handleTokenError();
          } 
      }
    }); 
    
  }


  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }


}
