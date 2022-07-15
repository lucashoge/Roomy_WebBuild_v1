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
    this.getUser();
  }

  showPerson:boolean=true;
  showWG:boolean=false;

  users: any;
  registerDenied: any;
  registerSuccessful: any;

  //Account
  Username: any;
  Email: any;
  Passwort: any;
  PasswortBest: any;
  passwordError: any;

  //Profil
    //Person
  Nachname: any;
  Vorname: any;
  Geschlecht: any;
  Geburtsdatum: any;
  Job: any;
  Hobby: any;
    //WG
  WGName: any;
  Postleitzahl: any;
  Stadt: any;
  Land: any;
  FreieSlots: any;
  SlotsGesamt: any;
  Preis: any;
    //beide
  Raucher: any;
  Lautstaerke: any;
  Sauberkeit: any;
  Kochen: any;
  //Profilbild: any;
  AktuellSuchend: any;

  kindOfUser: any;

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
      //Daten von User in passendes Format umwandeln und in Variablen speichern
      var userData = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))[0]))[0];
      console.log(userData);
      this.Username = userData.username;
      this.Email = userData.email;
      this.Raucher = userData.smoker;
      this.Lautstaerke = userData.volume;
      this.Sauberkeit = userData.tidiness;
      this.Kochen = userData.cook;
      this.AktuellSuchend = userData.searching;

      if(this.kindOfUser=="person"){
        //Daten von Person in passendes Format umwandeln und in Variablen speichern
      var personData = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))[1]))[0];
      console.log(personData);
      this.Vorname = personData.firstname;
      this.Nachname = personData.surname;
      this.Geschlecht = personData.gender;
      this.Geburtsdatum = personData.birthdate;
      this.Job = personData.job;
      this.Hobby = personData.hobby;
      }
      else if(this.kindOfUser=="wg"){
        //Daten von WG in passendes Format umwandeln und in Variablen speichern
      var wgData = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))[1]))[0];
      console.log(wgData);
      this.WGName = wgData.wgname;
      this.Postleitzahl = wgData.postcode;
      this.Stadt = wgData.city;
      this.Land = wgData.country;
      this.FreieSlots = wgData.spotsfree;
      this.SlotsGesamt = wgData.spotstotal;
      this.Preis = wgData.price;
      }
      else{
        console.log("Fehler beim Laden. \nDer Benutzertyp konnte nicht korrekt zugeordnet werden.");
      }
      
      
      


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


