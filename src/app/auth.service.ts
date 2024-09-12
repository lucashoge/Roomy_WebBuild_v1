/* import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
} */
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as moment from "moment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }


  setSession(authDetails: any) {
    const expiresAt = moment().add(authDetails.expiresIn,'hour' );
    console.log(authDetails.expiresIn);
     localStorage.setItem('id_token', authDetails.idToken);
     localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));

  }


  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("currentChat");
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("tokenErrorMessage");
    

    this.router.navigate(['/login']);
  }



  loggedIn() {
    return !!localStorage.getItem('id_token');
  }
}