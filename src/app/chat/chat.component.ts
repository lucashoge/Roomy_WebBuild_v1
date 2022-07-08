import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    console.log("ngOnInit chat component");
    this.getChats({email: "testPerson1@gmail.com"});
  }

  chatResult: any;
  fetchError: any;
  
  getChats(data: any) {
    var config = { params: data };

    console.log("getChats()");
    this.http.post<any>("allChatsFromPerson", { body: data }).subscribe((result) => {
      
      this.chatResult = result;
      console.log(this.chatResult);
    });
    //this.router.navigate(['/login']);
    
    return;
  };



    //Dann Nachricht, dass Registrierung erfolgreich
    //und Weiterleitung zum Login

    //Wenn nicht frei -> Nachricht(?) dass Name/Email bereits vergeben sind


}
