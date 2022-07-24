import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { HandleTokenErrorService } from '../handle-token-error.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, public datepipe: DatePipe, private handleToken: HandleTokenErrorService) { }

  chatResult: any[] = [];
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
      console.log("this.chatResult");
      console.log(this.chatResult);

      this.chatResult.forEach((element, index, arr) => {
        console.log("element")
        console.log(element)
        this.http.post<any>("chatEntriesFromID", { body: {chatid: element.chatid} }).subscribe((result) => {
          console.log("result")
          console.log(result)
          if(result.length > 0){
            this.chatResult[index].lastText = result[result.length-1].msgText;
            this.chatResult[index].lastText = this.chatResult[index].lastText.substring(0,17);
            if(this.chatResult[index].lastText.length > 17){
              this.chatResult[index].lastText = this.chatResult[index].lastText + "...";
            }
            
          }else{
            this.chatResult[index].lastText = "";
          }
          this.chatResult[index].lastMessage = this.datepipe.transform(this.chatResult[index].lastMessage, 'dd.MM');        
        },
        err => {
          console.log("Error");
          if (err instanceof HttpErrorResponse) {
            /*           if(err.status==401){
                this.handleToken.handleTokenError();
              }  */
          }
        });
      });
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

  openMain(){
    this.router.navigate(['/mainUI'])
  }
  



}
