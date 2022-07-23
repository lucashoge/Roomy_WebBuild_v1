import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { mergeNsAndName } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem("tokenErrorMessage");
  }

  showPerson:boolean=false;
  showWG:boolean=false;

  users: any;
  registerDenied: any;

  Username: any;
  Email: any;
  Nachname: any;
  Vorname: any;
  Passwort: any;
  PasswortBest: any;
  passwordError: any;
  registerSuccessful: any;

  Geschlecht: any;
  Geburtsdatum: any;

  WGName: any;
  Postleitzahl: any;
  Stadt: any;
  Land: any;

  kindOfUser: any ='person';

  pushPerson(){
    this.showPerson=true;
    this.showWG=false;
    this.kindOfUser = 'person';
    console.log(this.kindOfUser);
  }
  pushWG(){
    this.showPerson=false;
    this.showWG=true;
    this.kindOfUser = 'wg';
    console.log(this.kindOfUser);
  }
  
  
  sendRegister(data: any) {
    var userFlag = {
      "kindOfUser":this.kindOfUser
    };
    var merged = Object.assign(data, userFlag);
    var config = { params: merged}; 

    console.log(config);
    //Abfrage ob Passwörter übereinstimmen
    if (data.Passwort != data.PasswortBest) {
      this.passwordError = "Passwörter stimmen nicht überein.";
      return;
    }
    else {
      this.passwordError = "";
    }

    //Get abfrage, ob Username und Email vorhanden sind
    this.http.get("register", config).subscribe(result => {
      //Wenn Username und Email frei -> Eintragen der Daten in die Datenbank
      if (result == "registerAllowed") {
        this.http.post<any>("register", { body: data }).subscribe((result) => console.log("Result vom Post" + result));
        this.router.navigate(['/login']);
      }
      else if (result == "usernameUsed") {
        this.registerDenied = "Username bereits vergeben.";
      }
      else if (result == "emailUsed") {
        this.registerDenied = "Email bereits vergeben.";
      }
      return;
    });



    //Dann Nachricht, dass Registrierung erfolgreich
    //und Weiterleitung zum Login

    //Wenn nicht frei -> Nachricht dass Name/Email bereits vergeben sind


  }
  
}
