import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {


  parentSubject:Subject<string> = new Subject();

  constructor(private http: HttpClient, private router: Router) { }

  matchResult: any;
  loggedInUser: any;

  ngOnInit(): void {

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
      
        this.matchResult = result;
        console.log(this.matchResult);
      });

    }else{
      this.http.post<any>("getPossiblePersonMatchesByMail", { body: null }).subscribe((result) => {
      
        this.matchResult = result;
        console.log(this.matchResult);
      });
    }
    
    return;
  };

}
