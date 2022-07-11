import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";

@Component({
  selector: 'app-chatverlaeufe',
  templateUrl: './chatverlaeufe.component.html',
  styleUrls: ['./chatverlaeufe.component.css']
})
export class ChatverlaeufeComponent implements OnInit {
  
  chatWithUser: String|null = ""// = "";

  constructor() {
  
  }

  ngOnInit(): void {
    this.chatWithUser = localStorage.getItem('currentChat');
  }

}
