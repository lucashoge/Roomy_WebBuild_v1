import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private http: HttpClient, private router: Router ) { }

  ngOnInit(): void {
  }
  


  loginMessage: any;
  tokenErrorMessage: any=sessionStorage.getItem('tokenErrorMessage');
  kindOfUser: any;

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
        this.getUser();
        setTimeout(()=>{ this.router.navigate(['/mainUI']); }, 1000)
        
      }
    });
  }

  getUser(){
    var sendData = {
      flag: "getKindOfUser"
    }

    var config = {
      params: sendData
    };

    //Anfragen welcher Usertyp der Benutzer ist (WG oder Person)
    this.http.get("settings", config).subscribe(result => {
      var jas = JSON.parse(JSON.stringify(result))[0];
      this.kindOfUser = jas.usertype;
      this.loadUserData();
    },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  loadUserData() {
    var usertype: string = this.kindOfUser;
    var sendData = {
      flag: "getUserData",
      kindOfUser: usertype
    }

    var config = {
      params: sendData
    };

    //Userdaten anfragen
    this.http.get("settings", config).subscribe(result => {
      let resultArray: any;
      resultArray = result;

      localStorage.setItem("loggedInUser", JSON.stringify(resultArray[0]));
      console.log("loggedInUser: ");
      console.log(JSON.stringify(resultArray[0]));
    });
  }

  openReg() {
    this.router.navigate(['/register']);

  }
  openMain(){
    this.router.navigate(['/mainUI'])
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Items destroyed');
  }

  /* clearSessionStorage(){
    sessionStorage.removeItem("tokenErrorMessage");
  } */

}
