import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-main-ui',
  templateUrl: './main-ui.component.html',
  styleUrls: ['./main-ui.component.css'],
  
})
export class MainUiComponent {

  loggedInUser: any;
  toggleMatchAnimation: boolean = false;

  parentSubject:Subject<string> = new Subject();

  constructor(private http: HttpClient, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);
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
    this.toggleMatchAnimation = true;
  }


  


 

}
