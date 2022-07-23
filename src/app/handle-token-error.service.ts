import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HandleTokenErrorService {

  constructor(private router: Router) { }
  
  handleTokenError(){
    console.log("Ihr Login ist fehlerhaft oder ihre Sitzung ist abgelaufen.\nSie wurden automatisch ausgeloggt");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("currentChat");
    localStorage.removeItem("loggedInUser");
    sessionStorage.setItem('tokenErrorMessage', "Ihr Login ist fehlerhaft oder ihre Sitzung ist abgelaufen.\nSie wurden automatisch ausgeloggt");

    this.router.navigate(['/login']);
  }
}
