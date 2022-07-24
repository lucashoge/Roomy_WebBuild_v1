import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { HandleTokenErrorService } from '../handle-token-error.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private handleToken: HandleTokenErrorService) { }

  chatResult: any;
  fetchError: any;
  currentChatView = "";
  loggedInUser: any;

  ngOnInit(): void {
    console.log("ngOnInit chat component");
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.loggedInUser = JSON.parse(this.loggedInUser);

    this.getChats(this.loggedInUser);
  }

  getChats(data: any) {
    var config = { params: data };

    console.log("getChats()");
    this.http.post<any>("allChatsFromPerson", { body: null }).subscribe((result) => {
      
      this.chatResult = result;
      console.log(this.chatResult);
    },
    err => {
      if (err instanceof HttpErrorResponse) {
                  if(err.status==401){
            this.handleToken.handleTokenError();
          } 
      }
    });
    //this.router.navigate(['/login']);
    
    return;
  };


  onChatClick(data: any){
    console.log(data);
    localStorage.setItem("currentChat", data.chatid);
    this.router.navigate(['/chatverlaeufe']);
  }
  



}
