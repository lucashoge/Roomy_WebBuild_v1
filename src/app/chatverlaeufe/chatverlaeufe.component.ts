import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { now } from 'moment';
import { DatePipe } from '@angular/common';
import { HandleTokenErrorService } from '../handle-token-error.service';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

//import { LiveDataService } from '../live-data.service';

@Component({
  selector: 'app-chatverlaeufe',
  templateUrl: './chatverlaeufe.component.html',
  styleUrls: ['./chatverlaeufe.component.css'],
  //providers: [LiveDataService],
})
export class ChatverlaeufeComponent implements OnInit {
  
  chatid: String|null = "";// = "";
  chatMessages: any[] = [];
  loggedInUser: any;

  myWebSocket: WebSocketSubject<any> = webSocket({
    url: 'ws://localhost:9200/',
    deserializer: () => {}
  });

  constructor(
    private http: HttpClient, private router: Router, public datepipe: DatePipe, private handleToken: HandleTokenErrorService) 
  { 
    this.myWebSocket = webSocket({
      url: 'ws://localhost:9200/',
      deserializer: () => {}
    });
    this.myWebSocket.subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete') 
    });
    this.myWebSocket.next({message: 'some message'});
    
  }

  /*sendMsg() {
    let message = {
      source: '',
      content: ''
    };
    message.source = 'localhost';
    message.content = this.content;

    this.sent.push(message);
    this.WebsocketService.messages.next(message);
  }*/

  openChat(){
    this.router.navigate(['/chat'])
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
          } 
          if(err.status==503){
            sessionStorage.setItem("errorMessage", "503 Error Service Unavailable. Schorryy")
            this.router.navigate(['/error']);
          }
          if(err.status==500){
            sessionStorage.setItem("errorMessage", "500 Error Internal Server Error. Irgendwas ist da am Server schiefgelaufen")
            this.router.navigate(['/error']);
          }  */
      }
    });

    /*this.myWebSocket.asObservable().subscribe(dataFromServer =>{
      console.log("new message")
      console.log(dataFromServer)
      //this.chatMessages.push(dataFromServer);
    },
    err => {
      console.log("Error");
      console.log(err);
    });*/
  }

  submitMessage(event: any) {
    event.preventDefault();
    const target = event.target;
    const msgText = target.querySelector('#msgText').value;

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

