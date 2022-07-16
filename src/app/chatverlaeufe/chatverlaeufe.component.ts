import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chatverlaeufe',
  templateUrl: './chatverlaeufe.component.html',
  styleUrls: ['./chatverlaeufe.component.css']
})
export class ChatverlaeufeComponent implements OnInit {
  
  chatid: String|null = "";// = "";
  chatMessages: any;
  loggedInUser: any;

  constructor(private http: HttpClient, private router: Router, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);

    this.chatid = localStorage.getItem('currentChat');

    console.log("getChatEntries from chatID: " + this.chatid);
    this.http.post<any>("chatEntriesFromID", { body: {chatid: this.chatid} }).subscribe((result) => {
      
      this.chatMessages = result;
      console.log(this.chatMessages);
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
    });
  }

  getChatEntries(): void {

    this.http.post<any>("chatEntriesFromID", { body: {chatid: this.chatid} }).subscribe((result) => {
      this.chatMessages = result;
      console.log(this.chatMessages);
    });
  };
}

