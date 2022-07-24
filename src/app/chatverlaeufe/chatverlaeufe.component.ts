import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { HandleTokenErrorService } from '../handle-token-error.service';
import { LiveDataService } from '../live-data.service';

@Component({
  selector: 'app-chatverlaeufe',
  templateUrl: './chatverlaeufe.component.html',
  styleUrls: ['./chatverlaeufe.component.css']
})
export class ChatverlaeufeComponent implements OnInit {
  
  chatid: String|null = "";// = "";
  chatMessages: any[] = [];
  loggedInUser: any;

  constructor(
    //private LiveDataService: LiveDataService, 
    private http: HttpClient, private router: Router, public datepipe: DatePipe, 
    private handleToken: HandleTokenErrorService) { 
/*
      LiveDataService.messages.subscribe(msg => {
        this.chatMessages.push(msg);
        console.log("Response from websocket: " + msg);
      });*/
    }

  
  ngOnInit(): void {

    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);

    this.chatid = localStorage.getItem('currentChat');

    console.log("getChatEntries from chatID: " + this.chatid);
    this.http.post<any>("chatEntriesFromID", { body: {chatid: this.chatid} }).subscribe((result) => {
      
      this.chatMessages = result;
      console.log(this.chatMessages);
    },
    err => {
      console.log("Error");
      if (err instanceof HttpErrorResponse) {
        /*           if(err.status==401){
            this.handleToken.handleTokenError();
          }  */
      }
    });
  }

  submitMessage(event: any) {
    event.preventDefault();
    const target = event.target;
    const msgText = target.querySelector('#msgText').value;

    const date = new Date();
    const formatDate = this.datepipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
    console.log(formatDate);

    var messageForDB = {
      chateintragid: 0,
      chatid: this.chatid,
      msgText: msgText,
      msgDate: formatDate
    };

    console.log(messageForDB);

    this.http.post<any>("submitChatMessage", { body: messageForDB }).subscribe((result) => {
      console.log(result);
      this.getChatEntries();
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

  getChatEntries(): void {

    this.http.post<any>("chatEntriesFromID", { body: {chatid: this.chatid} }).subscribe((result) => {
      this.chatMessages = result;
      console.log(this.chatMessages);
    },
    err => {
      console.log("Error");
      if (err instanceof HttpErrorResponse) {
                  if(err.status==401){
            this.handleToken.handleTokenError();
          } 
      }
    });
  };
}

