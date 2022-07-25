import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  currentUser: any = {profilepic: "assets/Profilbild_default.jpg"};
  userID = 0;
  loggedInUser: any;


  public index = -1;
  switch = false;
  @Input()
  parentSubject!: Subject<any>;

  @Output() 
  matchFound = new EventEmitter<{ match: boolean }>();

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
        if(result.match != null){
          this.matchFound.emit({ match: result.match });
        }
      });
    }else{
      this.http.post<any>("submitMatch", { body: {idToMatch: this.currentUser.userid, usertype: this.loggedInUser.usertype, matchValue: 0} }).subscribe((result) => {
        console.log(result);
        if(result.match != null){
          this.matchFound.emit({ match: result.match });
        }
        
      },
      err => {
        console.log("Error");
        if (err instanceof HttpErrorResponse) {
                    if(err.status==401){
            this.handleToken.handleTokenError();
          } 
          if(err.status==503){
            sessionStorage.setItem("errorMessage", "503 Error Service Unavailable. Schorryy")
            this.router.navigate(['/error']);
          }
          if(err.status==500){
            sessionStorage.setItem("errorMessage", "500 Error Internal Server Error. Irgendwas ist da am Server schiefgelaufen")
            this.router.navigate(['/error']);
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
        localStorage.setItem("currentProfileViewUser", JSON.stringify(this.currentUser));
      }
      this.switch = false
    }else{
      this.switch = true;
    }
  }

  async getNewUsersForMatching() {
    var httpPostData = {minUserId: this.userID, sendingUser: this.loggedInUser, limit: "3"};
    this.http.post<any>("getUsersFromIdUpwards", { body: httpPostData}).subscribe((result) => {
      
      this.users = result;
      console.log("getNewUsersForMatching result:");
      console.log(this.users);
      if(this.users.length > 0){
        this.noMoreProfilesToBrowse = false;
        this.currentUser = this.users[0]; 
        localStorage.setItem("currentProfileViewUser", JSON.stringify(this.currentUser));
        console.log("currentUser from profiles" + this.currentUser)
        console.log(this.currentUser)
        this.userID = this.users[this.users.length-1].userid;
        if(this.currentUser.profilepic == ''){
          this.currentUser.profilepic = 'assets/Profilbild_default.jpg'
        }
        console.log("profilePicture: " + this.currentUser.profilepic)
      }else{
        console.log("noMoreProfilesToBrowse = true")
        this.noMoreProfilesToBrowse = true;
        this.currentUser = null;
      }
      
    },
    err => {
      console.log("Error:");
      console.log(err);
      if (err instanceof HttpErrorResponse) {
                  if(err.status==401){
            this.handleToken.handleTokenError();
          } 
          if(err.status==503){
            sessionStorage.setItem("errorMessage", "503 Error Service Unavailable. Schorryy")
            this.router.navigate(['/error']);
          }
          if(err.status==500){
            sessionStorage.setItem("errorMessage", "500 Error Internal Server Error. Irgendwas ist da am Server schiefgelaufen")
            this.router.navigate(['/error']);
          } 
      }
    }); 
    
  }

  changeToProfileView(){
    this.router.navigate(['/profileView']);
  }


  ngOnDestroy() {
    console.log('profile destroy');
    this.parentSubject.unsubscribe();
  }


}
