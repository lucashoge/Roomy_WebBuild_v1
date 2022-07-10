import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { mergeNsAndName } from '@angular/compiler';

@Component({
  selector: 'app-settings-editing',
  templateUrl: './settings-editing.component.html',
  styleUrls: ['./settings-editing.component.css']
})
export class SettingsEditingComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  //Userdaten
  userId = "";
  username = "";
  vorname = "";
  nachname = "";
  user_status: any;
  follows: any;

  ngOnInit(): void {
    this.loadUserData();
  }

  showPerson:boolean=true;
  showWG:boolean=false;

  users: any;
  registerDenied: any;

  Username: any = "Placeholder";
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

  loadUserData() {

    var sendData = {
      flag: "getUserData"
    }

    var config = {
      params: sendData
    };


    this.http.get("settings", config).subscribe(result => {
      var jas = JSON.parse(JSON.stringify(result))[0];
      this.userId = jas.user_id;
      this.Username = jas.username;
      this.Vorname = jas.vorname;
      this.Nachname = jas.nachname;
      this.user_status = jas.user_status;
      this.Email = jas.email;
    },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }




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
  
  
  sendSettings(data: any) {
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
    this.http.get("settings", config).subscribe(result => {
      //Wenn Username und Email frei -> Eintragen der Daten in die Datenbank
      if (result == "registerAllowed") {
        this.http.post<any>("settings", { body: data }).subscribe((result) => console.log("Result vom Post" + result));
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


