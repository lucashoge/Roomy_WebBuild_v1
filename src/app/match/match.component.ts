import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import { Subject } from 'rxjs';
import { HandleTokenErrorService } from '../handle-token-error.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {


  parentSubject:Subject<string> = new Subject();

  possibleMatchesFound: boolean = false;

  constructor(private http: HttpClient, private router: Router, private handleToken: HandleTokenErrorService) { }

  matchResult: any;
  loggedInUser: any;

  ngOnInit(): void {

    this.possibleMatchesFound = false;
    //get current user
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);
    console.log(this.loggedInUser);
    this.getPossibleMatches();
  }


  getPossibleMatches() {

    console.log("getPossibleMatches()");

    console.log(this.loggedInUser);
    //check if current user is WG or Person
    if(this.loggedInUser.usertype == "wg"){

      this.http.post<any>("getPossibleWgMatchesByMail", { body: null }).subscribe((result) => {
      
        console.log("matchResult");
        this.matchResult = result;
        console.log(this.matchResult);
        if(result.length > 0){
          this.possibleMatchesFound = true;
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

    }else{
      this.http.post<any>("getPossiblePersonMatchesByMail", { body: null }).subscribe((result) => {
      
        this.matchResult = result;
        console.log("matchResult");
        console.log(this.matchResult);
        if(result.length > 0){
          this.possibleMatchesFound = true;
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
    
    return;
  };

}
