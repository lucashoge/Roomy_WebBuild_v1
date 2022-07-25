import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private router: Router) { }

  errorMessage:any;
  ngOnInit(): void {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("currentChat");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("currentProfileViewUser");
    this.errorMessage = sessionStorage.getItem("errorMessage");
  }
  
login(){
this.router.navigate(["/login"]);
}

}
