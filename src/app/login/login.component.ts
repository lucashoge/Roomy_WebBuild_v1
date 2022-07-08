import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }


  loginMessage: any;

  loginUser(event: any) {
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;

    var userData = {
      Username: username,
      password: password 
    }

    var config = {
      params: userData,
      //responseType: 'text' as 'text'
    };

    this.http.get("api/login", config).subscribe(result => {
      if (result == "err") {
        //Login fehlgeschlagen
        this.loginMessage = "Benutzername oder Passwort falsch";
      }
      else {
        //Login erfolgreich
        this.auth.setSession(result);
        this.router.navigate(['/mainUI']);
      }
    });
  }

  


}
