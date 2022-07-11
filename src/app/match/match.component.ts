import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  matchResult: any;
  currentUser: any;

  ngOnInit(): void {

    //get current user
    this.currentUser = {email: "WGWGHansi@Hansihans.de", userid: 31, username: "HansiWGWG", usertype: "wg"};

    this.getPossibleMatches();


  }


  getPossibleMatches() {

    console.log("getPossibleMatches()");

    //check if current user is WG or Person
    if(this.currentUser.usertype == "wg"){

      this.http.post<any>("getPossibleWgMatchesByMail", { body: this.currentUser }).subscribe((result) => {
      
        this.matchResult = result;
        console.log(this.matchResult);
      });

    }else{
      this.http.post<any>("getPossiblePersonMatchesByMail", { body: this.currentUser }).subscribe((result) => {
      
        this.matchResult = result;
        console.log(this.matchResult);
      });
    }
    
    //this.router.navigate(['/login']);
    
    return;
  };

}
