import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { HandleTokenErrorService } from '../handle-token-error.service';
import {webSocket, WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';

import { LiveDataService } from '../live-data.service';

@Component({
  selector: 'app-chatverlaeufe',
  templateUrl: './chatverlaeufe.component.html',
  styleUrls: ['./chatverlaeufe.component.css'],
})
export class ChatverlaeufeComponent implements OnInit {
  
  chatid: String|null = "";// = "";
  chatMessages: any[] = [];
  loggedInUser: any;


  constructor(
    private websocket: LiveDataService, private http: HttpClient, private router: Router, public datepipe: DatePipe, private handleToken: HandleTokenErrorService) 
  { 
    websocket.connect('ws://localhost:9200/');

    websocket.messages.subscribe(msg => {
      //this.received.push(msg);
      console.log("Response from websocket: " + msg);
      this.getChatEntries()
    });
    
  }

  openChat(){
    this.router.navigate(['/chat'])
  }

  
  ngOnInit(): void {

    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);

    console.log(this.loggedInUser)

    this.chatid = localStorage.getItem('currentChat');

    console.log("getChatEntries from chatID: " + this.chatid);
    this.http.post<any>("chatEntriesFromID", { body: {chatid: this.chatid} }).subscribe((result) => {
      
      this.chatMessages = result;
      console.log(this.chatMessages);
    },
    err => {
      console.log("Error");
      if (err instanceof HttpErrorResponse) {
      }
    });

  }

  submitMessage(event: any) {
    event.preventDefault();
    const target = event.target;
    const msgText = target.querySelector('#msgText').value;
    target.querySelector('#msgText').value = '';

    if(msgText != ""){

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
        //this.chatMessages.push(messageForDB);
        //this.getChatEntries();
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

