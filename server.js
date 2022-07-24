 // set up ======================== 
 var express  = require('express'); 
 var app      = express();                               // create our app w/ express 
 var path     = require('path'); 
 var mysql    = require('mysql'); 
 var stringify = require('json-stringify-safe');

 // Importing the required modules
const WebSocketServer = require('ws');
  
 bodyParser = require('body-parser');
 const { ArgumentOutOfRangeError } = require('rxjs');
var mysql = require('mysql');
var stringify = require('json-stringify-safe');
var jwt = require('jsonwebtoken');
var fs = require("fs");
var formidable = require('formidable');
var glob = require("glob");
const { now } = require('moment');

// configuration =================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.static(path.join(__dirname, '/dist/my-new-angular-app')));

const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');
 
 
 // support parsing of application/json type post data
 app.use(bodyParser.json());
 
 //support parsing of application/x-www-form-urlencoded post data
 app.use(bodyParser.urlencoded({ extended: true }));
 
  // configuration =================
 app.use(express.static(path.join(__dirname, '/dist/my-new-angular-app')));  //TODO rename to your app-name

//Websocket
const wss = new WebSocketServer.Server({ port: 9200 })

// Creating connection using websocket
wss.on("connection", ws => {
  console.log("new client connected");
  // sending message
  ws.on("message", message => {
      //log the received message and send it back to the client
      console.log('received: %s', message);
      //send back the message to the other clients
      
  });
  // handling what to do when clients disconnects from server
  ws.on("close", () => {
      console.log("the client has disconnected");
  });
  // handling client connection error
  ws.onerror = function () {
      console.log("Some Error occurred")
  }
});
console.log("The WebSocket server is running on port 9200");

// MySQL connection =============

var conConfig = {
      database: "22_DB_Gruppe3",
      host: "195.37.176.178",
      port: "20133",
      user: "22_DB_Grp_3",
      password: "Ll12Z2>ftt-]hr>LU4uz",
      multipleStatements: true
    };






//Middleware -----------------------------------------------------------
function verifyToken(req, res, next) {
  try{
    if (!req.headers.authorization) {
    console.log("Kein Token vorhanden");
    return res.status(401).send("Unauthorized request");
    }
    var token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
      console.log("Token leer");
      return res.status(401).send("Unauthorized request");
    }
    
    const payload = jwt.verify(token, publicKey);
    if (!payload || payload == 'undefined') {
      console.log("Payload leer");
      return res.status(401).send("Unauthorized request");
    }
    req.userId = payload.sub;
    next();
  }catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized request");
    throw new Error(err)
  }
  


}




// application -------------------------------------------------------------

//Login Abfrage ob User (mit Passwort) existiert
app.get('/api/login', function (req, res) {

  var con = mysql.createConnection(conConfig);
  var userData = ["", ""];

  if (req.query.Username && req.query.password) {
    userData = [req.query.Username, req.query.password];
  }

  try{
    con.connect(function (error) {
      if (error) throw error;
      console.log("connected");
      con.query("SELECT username, userid FROM users WHERE username = ? AND password = ?;", userData, function (error, results, fields) {
        if (error) throw error;
        if (results != "") {
          console.log(results[0].userid);

          payload = { subject: stringify(results[0].userid) };

          const jwtBearerToken = jwt.sign({}, privateKey, {
            algorithm: 'RS256',
            expiresIn: '24h',
            subject: stringify(results[0].userid)
          });


          res.status(200).json({
            idToken: jwtBearerToken,
            expiresIn: '24h'
          });
        }
        else {
          res.send(stringify("err"));
        }
        con.end(function (error) {
          if (error) throw error;
          console.log("connection End");
        });
      });
    });
  }catch (err) {
    throw new Error(err)
  }

});


//Register Abfrage ob Username+Email bereits existieren
app.get('/register', function (req, res) {

  var con = mysql.createConnection(conConfig);
  var username;
  console.log("Got it");
  try{
    con.connect(function (error) {
      if (error) throw error;
      console.log("connected");
      //Abfragen ob Username / Email existieren
      if (!req.query.Username) {
        username = "";
      }
      else {
        username = req.query.Username;
      }
      if (!req.query.Email) {
        var email = "";
      }
      else {
        email = req.query.Email;
      }

      con.query("SELECT COUNT(*) AS 'countUsernames' FROM users WHERE username = ?;", username, function (error, results, fields) {
        if (error) throw error;
        console.log("Counted Users: " + results[0].countUsernames);
        if (results[0].countUsernames == 0) {
          //Username frei
          console.log("Username frei");
          con.query("SELECT COUNT(*) AS 'countEmails' FROM users WHERE email = ?;", email, function (error, results, fields) {
            if (error) throw error;
            console.log("Counted Emails: " + results[0].countEmails);

            if (results[0].countEmails == 0) {
              //Username und Email frei
              console.log("Username und Email frei");
              res.send(stringify("registerAllowed"));
            }
            else {
              //Email nicht frei
              console.log("Email nicht frei");
              res.send(stringify("emailUsed"));
            }
          });
        }
        else {
          //Username nicht frei
          console.log("Username nicht frei");
          res.send(stringify("usernameUsed"));
        }
        //res.send(stringify(results[0].count));
        //res.send(stringify("Halloloo"));
        con.end(function (error) {
          if (error) throw error;
        });
      });
    });
  }catch (err) {
  throw new Error(err)
  }
});




//Registrieren Neuen User in die Datenbank eintragen
app.post('/register', function (req, res) {
  console.log("Start");
  console.log(req.body);
  if(req.body.body.kindOfUser=='person'){
    console.log("Person");
    //Person
    var con = mysql.createConnection(conConfig);    
    try{
      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");
        con.query('INSERT INTO users SET ?;INSERT INTO person(personid)  select MAX(userid) as newid FROM users; UPDATE person SET ? where personid = (SELECT MAX(userid) FROM users); ', [{ username: req.body.body.Username, email: req.body.body.Email, password: req.body.body.Passwort, usertype: req.body.body.kindOfUser },{ firstname: req.body.body.Vorname, surname: req.body.body.Nachname, gender: req.body.body.Geschlecht, birthdate: req.body.body.Geburtsdatum }],
          function (error, results, fields) {
            if (error) throw error;
            console.log(results[0]);
            console.log(results[1]);
            console.log(results[2]);
            con.end(function (error) {
              if (error) throw error;
              console.log("connection End");
            });
          });
      });
    }catch (err) {
      throw new Error(err)
    }
  }
  else if(req.body.body.kindOfUser=='wg'){
    console.log("WG");
    //WG
    var con = mysql.createConnection(conConfig);   
      try{ 
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('INSERT INTO users SET ?;INSERT INTO wg(wgid)  select MAX(userid) as newid FROM users; UPDATE wg SET ? where wgid = (SELECT MAX(userid) FROM users); ', [{ username: req.body.body.Username, email: req.body.body.Email, password: req.body.body.Passwort, usertype: req.body.body.kindOfUser },{ wgname: req.body.body.WGName, postcode: req.body.body.Postleitzahl, city: req.body.body.Stadt, country: req.body.body.Land }],
            function (error, results, fields) {
              if (error) throw error;
              console.log(results[0]);
              console.log(results[1]);
              console.log(results[2]);
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
      }catch (err) {
        throw new Error(err)
      }
  }
      
    });


//Userdaten für Settings abrufen/prüfen
app.get('/settings', verifyToken, function (req, res) {
  console.log("Start Settings");
  console.log("kindOfUser: "+req.query.kindOfUser);
  console.log("flag: "+req.query.flag);

  var userid = [req.userId];
//___________________________________________________________________________Usertyp abfragen
  if (req.query.flag == "getKindOfUser") {
    var con = mysql.createConnection(conConfig);
    try{
      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");
        con.query("SELECT usertype  FROM users WHERE userid = ?;", userid,
          function (error, results, fields) {
            if (error) throw error;
            console.log("sending back");
            console.log(results);
            res.send(stringify(results));
            con.end(function (error) {
              if (error) throw error;
              console.log("connection End");
            });
          });
      });
    }catch (err) {
      throw new Error(err)
    }
  }

//___________________________________________________________________________Userdaten abfragen
  else if (req.query.flag == "getUserData") {
    var con = mysql.createConnection(conConfig);
    
    console.log("inside GetUserData");
    //Wenn User eine Person ist
    if(req.query.kindOfUser == "person"){
      console.log("inside Person");
      try{
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");

          var sqlQuery = 'SELECT username, email, profilepic, smoker, volume, tidiness, cook, searching, usertype, firstname, surname, gender, birthdate, job, hobby, searchpostcode, searchcity, searchcountry, dog, cat, bird, others'
              + ' FROM 22_DB_Gruppe3.users'
              + ' LEFT JOIN 22_DB_Gruppe3.person AS personTable ON userid=personTable.personid'
              + ' LEFT JOIN 22_DB_Gruppe3.pet AS petTable ON userid=petTable.petid'
              + ' WHERE 22_DB_Gruppe3.users.userid=' + userid;


          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
      }catch (err) {
        throw new Error(err)
      }
    }
    

      //Wenn user eine WG ist
      else if(req.query.kindOfUser == "wg"){
        
      console.log("inside WG");
        console.log("get wg data");
        try{
          con.connect(function (error) {
            if (error) throw error;
            console.log("connected");

            var sqlQuery = 'SELECT username, email, profilepic, smoker, volume, tidiness, cook, searching, usertype, wgname, postcode, city, country, spotfree, spotstotal, price, dog, cat, bird, others'
                + ' FROM 22_DB_Gruppe3.users'
                + ' LEFT JOIN 22_DB_Gruppe3.wg AS wgTable ON userid=wgTable.wgid'
              + ' LEFT JOIN 22_DB_Gruppe3.pet AS petTable ON userid=petTable.petid'
                + ' WHERE 22_DB_Gruppe3.users.userid=' + userid;

            con.query(sqlQuery,
              function (error, results, fields) {
                if (error) throw error;
                res.send(stringify(results));
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
              });
          });
        }catch (err) {
          throw new Error(err)
        }
      }
      else{console.log("No Person No WG");}
    }
    //___________________________________________________________________________Änderungen Prüfen_______________________________________________________

    //___________________________________________________________________________Prüfen ob neue Email schon existiert
    else if(req.query.flag == "checkMail"){
      var con = mysql.createConnection(conConfig);
      try{
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          //Abfragen Email existiert
          if (!req.query.Email) {
            var email = "";
          }
          else {
            email = req.query.Email;
          }
          con.query("SELECT COUNT(*) AS 'countEmails' FROM users WHERE email = ?;", email, function (error, results, fields) {
            if (error) throw error;
            console.log("Counted: " + results.countEmails);
            console.log("Counted Emails: " + results[0].countEmails);
            if (results[0].countEmails == 0) {
              //Email frei
              console.log("Email frei");
              res.send(stringify("emailAllowed"));
            }
            else {
              //Email nicht frei
              console.log("Email nicht frei");
              res.send(stringify("emailUsed"));
            }
          });
          con.end(function (error) {
            if (error) throw error;
          });
        });
      }catch (err) {
        throw new Error(err)
      }
    }
    
    //___________________________________________________________________________Prüfen ob neuer Username schon existiert
    else if(req.query.flag == "checkUsername"){
      var con = mysql.createConnection(conConfig);
      try{
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          //Abfragen Email existiert
          if (!req.query.Username) {
            var username = "";
          }
          else {
            username = req.query.Username;
          }
          console.log(username);
          con.query("SELECT COUNT(*) AS 'countUsernames' FROM users WHERE username = ?;", username, function (error, results, fields) {
            if (error) throw error;
            console.log("Counted: " + results.countUsernames);
            console.log("Counted Users: " + results[0].countUsernames);
            if (results[0].countUsernames == 0) {
              //Usernamefrei
              console.log("Username frei");
              res.send(stringify("usernameAllowed"));
            }
            else {
              //Username nicht frei
              console.log("Username nicht frei");
              res.send(stringify("usernameUsed"));
            }
          });
          con.end(function (error) {
            if (error) throw error;
          });
        });
      }catch (err) {
        throw new Error(err)
      }
    }

    //___________________________________________________________________________Prüfen ob Passwort übereinstimmt
    else if(req.query.flag == "checkPassword"){
      var con = mysql.createConnection(conConfig);
      try{
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          console.log(req.query.passwort);
          //Abfragen ob Passwort existiert
          if (!req.query.passwort) {
            var passwort = "";
          }
          else {
            passwort = req.query.passwort;
          }
          console.log(passwort);
          con.query("SELECT COUNT(*) AS 'countPasswords' FROM users WHERE userid = ? AND password = ?;", [userid, passwort], function (error, results, fields) {
            if (error) throw error;
            console.log("Counted passwords: " + results[0].countPasswords);
            if (results[0].countPasswords == 0) {
              //Passwort falsch
              console.log("Passwort falsch");
              res.send(stringify("passwordWrong"));
            }
            else {
              //Passwort richtig
              console.log("Passwort richtig");
              res.send(stringify("passwordCorrect"));
            }
          });
          con.end(function (error) {
            if (error) throw error;
          });
        });
      }catch (err) {
        throw new Error(err)
      }
    }
    //______________________________________________________Änderungen derr Settings in die Datenbank eintragen_______________________________________________________

    //___________________________________________________________________________Email ändern
    else if(req.query.flag =="changeMail"){
      console.log("Email");
      //email
      var con = mysql.createConnection(conConfig);
        try{
          con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
            con.query('UPDATE users SET ? WHERE userid = ?;', [{ email: req.query.Email},userid],
              function (error, results, fields) {
                if (error) throw error;
                console.log("Update Done");
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
              });
          });
        }catch (err) {
          throw new Error(err)
        }
    }
    //___________________________________________________________________________Usernamen ändern
    else if(req.query.flag=="changeUsername"){
      console.log("Change Username");
      //Username
      var con = mysql.createConnection(conConfig);   
      try{ 
          con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
            con.query('UPDATE users SET ? where userid = ?;', [{ username: req.query.Username},userid],
              function (error, results, fields) {
                if (error) throw error;
                console.log("Update Done");
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
              });
          });
        }catch (err) {
          throw new Error(err)
        }
    }
    //___________________________________________________________________________Passwort ändern
    else if(req.query.flag=="changePasswort"){
      console.log("Change Password");
      //Username
      var con = mysql.createConnection(conConfig); 
        try{   
          con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
            con.query('UPDATE users SET ? where userid = ?;', [{ password: req.query.Passwort},userid],
              function (error, results, fields) {
                if (error) throw error;
                console.log("Update Done");
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
              });
          });
        }catch (err) {
          throw new Error(err)
        }
    }
    //___________________________________________________________________________Profil ändern 
    else if(req.query.flag=="changeProfile"){
      console.log("Change Profil");
      //Prüfen welche Werte vorhanden sind
      var valueList={};
      if(req.query.Nachname){
        valueList = Object.assign(valueList, {surname: req.query.Nachname});
      }
      if(req.query.Vorname){
        valueList = Object.assign(valueList, {firstname: req.query.Vorname});
      }
      if(req.query.Geschlecht){
        valueList = Object.assign(valueList, {gender: req.query.Geschlecht});
      }
      if(req.query.Geburtsdatum){
        valueList = Object.assign(valueList, {birthdate: req.query.Geburtsdatum});
      }
      if(req.query.Job){
        valueList = Object.assign(valueList, {job: req.query.Job});
      }
      if(req.query.Hobby){
        valueList = Object.assign(valueList, {hobby: req.query.Hobby});
      }
      if(req.query.WGName){
        valueList = Object.assign(valueList, {wgname: req.query.WGName});
      }
      if(req.query.Postleitzahl){
        valueList = Object.assign(valueList, {postcode: req.query.Postleitzahl});
      }
      if(req.query.Stadt){
        valueList = Object.assign(valueList, {city: req.query.Stadt});
      }
      if(req.query.Land){
        valueList = Object.assign(valueList, {country: req.query.Land});
      }
      if(req.query.FreieSlots){
        valueList = Object.assign(valueList, {spotfree: parseInt(req.query.FreieSlots)});
      }
      if(req.query.SlotsGesamt){
        valueList = Object.assign(valueList, {spotstotal: parseInt(req.query.SlotsGesamt)});
      }
      if(req.query.Preis){
        valueList = Object.assign(valueList, {price: parseFloat(req.query.Preis)});
      }
      //Person
      if(req.query.kindOfUser=="person"){
        var con = mysql.createConnection(conConfig);    
        try{
          if(Object.keys(valueList).length >0){
            con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
            con.query('UPDATE person SET ? where personid = ?;', [valueList,userid],
              function (error, results, fields) {
                if (error) throw error;
                console.log("Update Done");
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
              });
          });
          }
          
        }catch (err) {
          throw new Error(err)
        }
      }
      //WG
      if(req.query.kindOfUser=="wg"){
        var con = mysql.createConnection(conConfig);  
        try{  
          if(Object.keys(valueList).length >0){
            con.connect(function (error) {
              if (error) throw error;
              console.log("connected");
              con.query('UPDATE wg SET ? where wgid = ?;', [valueList,userid],
                function (error, results, fields) {
                  if (error) throw error;
                  console.log("Update Done");
                  con.end(function (error) {
                    if (error) throw error;
                    console.log("connection End");
                  });
                });
            });
          }
        }catch (err) {
          throw new Error(err)
        }
      }

      //Haustiere
      var valueListPet={};
      if(req.query.Hund=="true"){
        valueListPet = Object.assign(valueListPet, {dog: true});
      }
      else if(req.query.Hund=="false"){
        valueListPet = Object.assign(valueListPet, {dog: false});
      }
      if(req.query.Katze=="true"){
        valueListPet = Object.assign(valueListPet, {cat: true});
      }
      else if(req.query.Katze=="false"){
        valueListPet = Object.assign(valueListPet, {cat: false});
      }
      if(req.query.Vogel=="true"){
        valueListPet = Object.assign(valueListPet, {bird: true});
      }
      else if(req.query.Vogel=="false"){
        valueListPet = Object.assign(valueListPet, {bird: false});
      }
      if(req.query.AndereTiere=="true"){
        valueListPet = Object.assign(valueListPet, {others: true});
      }
      else if(req.query.AndereTiere=="false"){
        valueListPet = Object.assign(valueListPet, {others: false});
      }

      if(Object.keys(valueListPet).length >0){

        console.log("Change Pets_________________");
        var con = mysql.createConnection(conConfig);  
        try{  
          con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
            con.query('UPDATE pet SET ? where petid = ?;', [valueListPet,userid],
              function (error, results, fields) {
                if (error) throw error;
                console.log("Update Done");
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
            });
          });
        }catch (err) {
          throw new Error(err)
        }
      }



    }

    //___________________________________________________________________________Matching ändern 
    else if(req.query.flag=="changeMatching"){
      console.log("Change Matching");
      console.log("Flag: "+req.query.flag);
      console.log("Raucher: "+req.query.Raucher);
      //Prüfen welche Werte vorhanden sind
      var valueListUser={};
      if(req.query.Raucher){
        if(req.query.Raucher=="true"){
          valueListUser = Object.assign(valueListUser, {smoker: true});
        }
        else if(req.query.Raucher=="false"){
          valueListUser = Object.assign(valueListUser, {smoker: false});
        }
      }
      if(req.query.Lautstaerke){
        valueListUser = Object.assign(valueListUser, {volume: parseInt(req.query.Lautstaerke)});
      }
      if(req.query.Sauberkeit){
        valueListUser = Object.assign(valueListUser, {tidiness: parseInt(req.query.Sauberkeit)});
      }
      if(req.query.Kochen){
        valueListUser = Object.assign(valueListUser, {cook: parseInt(req.query.Kochen)});
      }
      if(req.query.AktuellSuchend=="true"){
        valueListUser = Object.assign(valueListUser, {searching: true});
      }
      else if(req.query.AktuellSuchend=="false"){
        valueListUser = Object.assign(valueListUser, {searching: false});
      }

      var valueListPerson={};
      if(req.query.SuchePostleitzahl){
        valueListPerson = Object.assign(valueListPerson, {searchpostcode: req.query.SuchePostleitzahl});
      }
      if(req.query.SucheStadt){
        valueListPerson = Object.assign(valueListPerson, {searchcity: req.query.SucheStadt});
      }
      if(req.query.SucheLand){
        valueListPerson = Object.assign(valueListPerson, {searchcountry: req.query.SucheLand});
      }
      console.log("Raucher: "+req.query.Raucher);
      console.log("Sauberkeit Int: "+parseInt(req.query.Sauberkeit));
      //Person
      if(req.query.kindOfUser=="person"){
        if(!req.query.SuchePostleitzahl && !req.query.SucheStadt && !req.query.SucheLand && !req.query.Raucher && !req.query.Lautstaerke && !req.query.Kochen && !req.query.AktuellSuchend){
          console.log("Alles Leer. Nichts gemacht.");
        }
        else if(!req.query.SuchePostleitzahl && !req.query.SucheStadt && !req.query.SucheLand){
          console.log("SuchePlz,SucheStadt und SucheLand leer");
          var con = mysql.createConnection(conConfig);
          try{    
            con.connect(function (error) {
              if (error) throw error;
              console.log("connected");
              con.query('UPDATE users SET ? where userid = ?;', [valueListUser,userid],
                function (error, results, fields) {
                  if (error) throw error;
                  console.log("Update Done");
                  con.end(function (error) {
                    if (error) throw error;
                    console.log("connection End");
                  });
                });
            }); 
          }catch (err) {
            throw new Error(err)
          }
        }
        else if(!req.query.Raucher && !req.query.Lautstaerke && !req.query.Kochen && !req.query.AktuellSuchend){
          
          console.log("Raucher, Lautstaerke,Kochen, Suchend leer");
          var con = mysql.createConnection(conConfig); 
          try{   
            con.connect(function (error) {
              if (error) throw error;
              console.log("connected");
              con.query('UPDATE person SET ? where personid = ?;', [valueListPerson,userid],
                function (error, results, fields) {
                  if (error) throw error;
                  console.log("Update Done");
                  con.end(function (error) {
                    if (error) throw error;
                    console.log("connection End");
                  });
                });
            }); 
          }catch (err) {
            throw new Error(err)
          }
        }
        else{
          console.log("Nichts leer");
          var con = mysql.createConnection(conConfig); 
          try{   
            con.connect(function (error) {
              if (error) throw error;
              console.log("connected");
              con.query('UPDATE users SET ? where userid = ?; UPDATE person SET ? where personid = ?;', [valueListUser,userid,valueListPerson, userid],
                function (error, results, fields) {
                  if (error) throw error;
                  console.log("Update Done");
                  con.end(function (error) {
                    if (error) throw error;
                    console.log("connection End");
                  });
                });
            });
          }catch (err) {
            throw new Error(err)
          }
        }
        
      }
      //WG
      if(req.query.kindOfUser=="wg"){
        var con = mysql.createConnection(conConfig); 
        try{   
          con.connect(function (error) {
            if (error) throw error;
            console.log("connected");
            con.query('UPDATE users SET ? where userid = ?;', [valueListUser,userid],
              function (error, results, fields) {
                if (error) throw error;
                console.log("Update Done");
                con.end(function (error) {
                  if (error) throw error;
                  console.log("connection End");
                });
              });
          });
        }catch (err) {
          throw new Error(err)
        }
      }
      
    }




    else{console.log("nothing done");}

});













  // get all chats of a person:
  /*
  *
    SELECT 22_DB_Gruppe3.chat.chatid,22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid,22_DB_Gruppe3.chat.fk_wgid, userTable.email AS userMail, wgTable.email AS wgMail
    FROM 22_DB_Gruppe3.chat
    LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid
    LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid
    WHERE userTable.email="hansi@hallo.de" OR wgTable.email="hansi@hallo.de";
   */


  app.post('/allChatsFromPerson', verifyToken, function (req, res) {

    var userid = [req.userId];

    var con = mysql.createConnection(conConfig);
  
      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");
        con.query('SELECT *, userTable.email AS userMail, wgTable.email AS wgMail FROM 22_DB_Gruppe3.chat LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid WHERE userTable.userid="' + userid +'" OR wgTable.userid="' + userid +'"',
          function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            res.send(stringify(results));
            con.end(function (error) {
              if (error) throw error;
              console.log("connection End");
            });
          });
      });
  });

  // get all chat entries of a specified chat
  /*
  *
    SELECT 22_DB_Gruppe3.chateintrag.msgDate, 22_DB_Gruppe3.chateintrag.msgText,22_DB_Gruppe3.chateintrag.from_id, 22_DB_Gruppe3.chateintrag.chatid, userTable.email AS userMail
    FROM 22_DB_Gruppe3.chateintrag
    LEFT JOIN 22_DB_Gruppe3.users AS userTable ON from_id=userTable.userid
    WHERE 22_DB_Gruppe3.chateintrag.chatid=1
   */


    app.post('/chatEntriesFromID', function (req, res) {

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('SELECT 22_DB_Gruppe3.chateintrag.msgDate, 22_DB_Gruppe3.chateintrag.msgText,22_DB_Gruppe3.chateintrag.from_id, 22_DB_Gruppe3.chateintrag.chatid, userTable.email AS userMail FROM 22_DB_Gruppe3.chateintrag LEFT JOIN 22_DB_Gruppe3.users AS userTable ON from_id=userTable.userid WHERE 22_DB_Gruppe3.chateintrag.chatid=' + req.body.body.chatid + ' ORDER BY msgDate',
            function (error, results, fields) {
              if (error) throw error;
              console.log(req.body.body.chatid);
              console.log(results);
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });


    //Add a chat entry
    /*
    INSERT INTO 22_DB_Gruppe3.chateintrag (msgDate, msgText, from_id, chatid)
    VALUES ("2022-06-07 11:07:03", "Hello4", 18, 1) 
  */

    app.post('/submitChatMessage', verifyToken, function (req, res) {

      var userid = [req.userId];

      var con = mysql.createConnection(conConfig);
      var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('INSERT INTO 22_DB_Gruppe3.chateintrag SET ?', [{ msgDate: req.body.body.msgDate, msgText: req.body.body.msgText, from_id: userid, chatid: req.body.body.chatid,}],
            function (error, results, fields) {
              if (error) throw error;

              con.query('UPDATE 22_DB_Gruppe3.chat SET lastMessage="'+req.body.body.msgDate+'" WHERE chatid='+req.body.body.chatid,
              function (error, results, fields) {
                if (error) throw error;

                wss.clients.forEach(client => {
                  console.log("for each client")
                  if (client != ws) {
                    client.send([{ msgDate: req.body.body.msgDate, msgText: req.body.body.msgText, from_id: userid, chatid: req.body.body.chatid,}]);
                  }    
                });

              });
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });


    //Get All matches
    /*
    SELECT 22_DB_Gruppe3.match.fk_personid, 22_DB_Gruppe3.match.fk_wgid, 22_DB_Gruppe3.match.wgmatch, 22_DB_Gruppe3.match.personmatch,userTable.email AS userMail, wgTable.email AS wgMail
    FROM 22_DB_Gruppe3.match 
    LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid
    LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid
    WHERE (userTable.email="hansi@hallo.de" OR wgTable.email="hansi@hallo.de") AND (22_DB_Gruppe3.match.wgmatch=1 AND 22_DB_Gruppe3.match.personmatch=1);
    */

    app.post('/getMatchesByMail', verifyToken, function (req, res) {

      var userid = [req.userId];

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT 22_DB_Gruppe3.match.fk_personid, 22_DB_Gruppe3.match.fk_wgid, 22_DB_Gruppe3.match.wgmatch, 22_DB_Gruppe3.match.personmatch,userTable.email AS userMail, wgTable.email AS wgMail'
            + ' FROM 22_DB_Gruppe3.match'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid'
            + ' WHERE (userTable.userid="' + userid + '" OR wgTable.userid="' + userid + '") AND (22_DB_Gruppe3.match.wgmatch=1 AND 22_DB_Gruppe3.match.personmatch=1)';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });


    //Get All possible matches for a person
    /*
    SELECT *
    FROM 22_DB_Gruppe3.match 
    LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid
    WHERE userTable.email="hansi@hallo.de" AND (22_DB_Gruppe3.match.wgmatch=1 AND 22_DB_Gruppe3.match.personmatch=0)
    */

    app.post('/getPossiblePersonMatchesByMail', verifyToken, function (req, res) {

      var userid = [req.userId];

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT *'
            + ' FROM 22_DB_Gruppe3.match'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_wgid=userTable.userid'
            + ' WHERE 22_DB_Gruppe3.match.fk_personid="' + userid + '" AND (22_DB_Gruppe3.match.personmatch=0 AND 22_DB_Gruppe3.match.wgmatch=1)';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });


    //Get All possible matches for a WG
    /*
    SELECT *
    FROM 22_DB_Gruppe3.match 
    LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid
    WHERE userTable.email="hansi@hallo.de" AND (22_DB_Gruppe3.match.wgmatch=0 AND 22_DB_Gruppe3.match.personmatch=1)
    */

    app.post('/getPossibleWgMatchesByMail', verifyToken, function (req, res) {

      var userid = [req.userId];

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT *'
            + ' FROM 22_DB_Gruppe3.match'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid'
            + ' WHERE 22_DB_Gruppe3.match.fk_wgid="' + userid + '" AND (22_DB_Gruppe3.match.wgmatch=0 AND 22_DB_Gruppe3.match.personmatch=1)';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });


    //Get 20 users from ID upwards
    /*
    SELECT *
    FROM 22_DB_Gruppe3.match 
    LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid
    WHERE userTable.email="hansi@hallo.de" AND (22_DB_Gruppe3.match.wgmatch=0 AND 22_DB_Gruppe3.match.personmatch=1)
    */

    app.post('/getUsersFromIdUpwards', verifyToken,function (req, res) {

      var userType = "";
      var limit = req.body.body.limit;
      var minUserID = req.body.body.minUserId;
      var userid = [req.userId];
      var sendingUser = req.body.body.sendingUser;

      var sqlQuery = "";

      if(req.body.body.sendingUser.usertype == "wg"){
        userType = "person";

        sqlQuery = 'SELECT * FROM 22_DB_Gruppe3.users'
        + ' LEFT JOIN 22_DB_Gruppe3.person AS personTable ON userid=personTable.personid'
        + ' LEFT JOIN 22_DB_Gruppe3.match AS matchTable ON userid=matchTable.fk_personid'
        + ' WHERE usertype="' + userType + '" AND userid>' + minUserID +''
        + ' AND (matchTable.wgseen=0 OR matchTable.wgseen IS NULL) AND (matchTable.fk_wgid="'+userid+'" OR matchTable.fk_wgid IS NULL)'
        + ' AND (users.searching=1 OR users.searching IS NULL) '

        if(sendingUser.smoker)
          sqlQuery = sqlQuery + 'AND (users.smoker='+sendingUser.smoker+' OR users.smoker IS NULL) ';
        if(sendingUser.volume)
          sqlQuery = sqlQuery + 'AND ((users.volume<'+sendingUser.volume+'+4 AND users.volume >'+sendingUser.volume+'-4) OR users.volume IS NULL) '
        if(sendingUser.tidiness)
          sqlQuery = sqlQuery + 'AND ((users.tidiness<'+sendingUser.tidiness+'+4 AND users.tidiness >'+sendingUser.tidiness+'-4) OR users.tidiness IS NULL) '
        if(sendingUser.cook)
          sqlQuery = sqlQuery  + 'AND ((users.cook<'+sendingUser.cook+'+4 AND users.cook >'+sendingUser.cook+'-4) OR users.cook IS NULL) '
        
        sqlQuery = sqlQuery + 'limit ' + limit + ';';

        

      }else{
        userType = "wg";

        sqlQuery = 'SELECT * FROM 22_DB_Gruppe3.users '
        + 'LEFT JOIN 22_DB_Gruppe3.wg AS wgTable ON userid=wgTable.wgid '
        + 'LEFT JOIN 22_DB_Gruppe3.match AS matchTable ON userid=matchTable.fk_wgid '
        + 'WHERE usertype="'+userType+'" AND userid>' + minUserID +' '
        + 'AND (matchTable.personseen=0 OR matchTable.personseen IS NULL) '
        + 'AND (matchTable.fk_personid="'+userid+'" OR matchTable.fk_personid IS NULL) '
        + 'AND (users.searching=1 OR users.searching IS NULL) '
        if(sendingUser.smoker)
          sqlQuery = sqlQuery + 'AND (users.smoker='+sendingUser.smoker+' OR users.smoker IS NULL) ';
        if(sendingUser.volume)
          sqlQuery = sqlQuery + 'AND ((users.volume<'+sendingUser.volume+'+4 AND users.volume >'+sendingUser.volume+'-4) OR users.volume IS NULL) '
        if(sendingUser.tidiness)
          sqlQuery = sqlQuery + 'AND ((users.tidiness<'+sendingUser.tidiness+'+4 AND users.tidiness >'+sendingUser.tidiness+'-4) OR users.tidiness IS NULL) '
        if(sendingUser.cook)
          sqlQuery = sqlQuery  + 'AND ((users.cook<'+sendingUser.cook+'+4 AND users.cook >'+sendingUser.cook+'-4) OR users.cook IS NULL) '
        
        sqlQuery = sqlQuery + 'limit ' + limit + ';';
      }

      console.log(sqlQuery);

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
         

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.send(stringify(results));
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });


  //Add a chat entry
    /*
    INSERT INTO 22_DB_Gruppe3.chateintrag (msgDate, msgText, from_id, chatid)
    VALUES ("2022-06-07 11:07:03", "Hello4", 18, 1) 
  */

    app.post('/submitMatch', verifyToken, function (req, res) {

      var userid = [req.userId];

      var queryParams = [{}];
      var sqlQuery0 = '';
      var sqlQuery1 = '';
      var sqlQuery2 = '';
      var sqlQuery3 = '';

      var matchValue = req.body.body.matchValue;

      console.log(req.body.body.usertype)

      

      if(req.body.body.usertype == "wg"){
        queryParams = [{
          fk_personid: req.body.body.idToMatch,
          fk_wgid: userid,
          wgmatch: 1,
          personmatch: 0
        }];
        sqlQuery0 = "SELECT COUNT(*) AS 'countMatches' FROM 22_DB_Gruppe3.match WHERE fk_wgid = " + userid + " AND fk_personid = " + req.body.body.idToMatch;
        sqlQuery1 = "SELECT COUNT(*) AS 'countMatches' FROM 22_DB_Gruppe3.match WHERE fk_wgid = " + userid + " AND fk_personid = " + req.body.body.idToMatch + " AND personmatch=1";
        sqlQuery2 = 'INSERT INTO 22_DB_Gruppe3.match SET fk_wgid='+userid+', fk_personid='+req.body.body.idToMatch+', personmatch=0, wgmatch='+matchValue+', wgseen=1';
        sqlQuery3 = 'UPDATE 22_DB_Gruppe3.match SET wgmatch='+matchValue+', wgseen=1 WHERE fk_personid='+req.body.body.idToMatch+' AND fk_wgId='+userid+';'
      }else{
        queryParams = [{
          fk_personid: userid,
          fk_wgid: req.body.body.idToMatch,
          personmatch: 1,
          wgmatch: 0
        }];
        sqlQuery0 = "SELECT COUNT(*) AS 'countMatches' FROM 22_DB_Gruppe3.match WHERE fk_personid = " + userid + " AND fk_wgid = " + req.body.body.idToMatch;
        sqlQuery1 = "SELECT COUNT(*) AS 'countMatches' FROM 22_DB_Gruppe3.match WHERE fk_personid = " + userid + " AND fk_wgid = " + req.body.body.idToMatch + " AND wgmatch=1";
        sqlQuery2 = 'INSERT INTO 22_DB_Gruppe3.match SET fk_personid='+userid+', fk_wgid='+req.body.body.idToMatch+', personmatch='+matchValue+', personseen=1, wgmatch=0';
        sqlQuery3 = 'UPDATE 22_DB_Gruppe3.match SET personmatch='+matchValue+', personseen=1 WHERE fk_wgid='+req.body.body.idToMatch+' AND fk_personId='+userid+';'
      }
      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");

          
          //Match already in DB
          //con.query(sqlQuery0, function (error, results, fields) {

            if (matchValue == 1) {

              //check if match from other person/wg is available
              con.query(sqlQuery1, function (error, results, fields) {
            
                
                //Wenn keine matches gefunden wurden
                if (results[0].countMatches == 0) {
                  console.log("kein match gefunden!");

                  //gibt es schon einen Eintrag in der DB
                  con.query(sqlQuery0, function (error, results, fields) {
                    if (results[0].countMatches == 0) {

                      console.log(sqlQuery2)
                      con.query(sqlQuery2, function (error, results, fields) {
                        console.log(results);
                        res.send({match: false});

                        con.end(function (error) {
                          if (error) throw error;
                          console.log("connection End");
                        });
                      });
                    }else{
                      con.query(sqlQuery3, function (error, results, fields) {
                        console.log(results);
                        res.send({match: false});
                        con.end(function (error) {
                          if (error) throw error;
                          console.log("connection End");
                        });
                      });
                    }
                  });

                  
    
                //Wenn ein match gefunden wurde
                }else{
                  console.log("match gefunden! update: " + sqlQuery3);
                  con.query(sqlQuery3, function (error, results, fields) {
                    if (error) throw error;
    
                    //Add Chat
                    var sqlQueryChat = "";
                    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    if(req.body.body.usertype == "wg"){
                      sqlQueryChat='INSERT INTO 22_DB_Gruppe3.chat SET fk_wgid='+userid+', fk_personid='+req.body.body.idToMatch+', lastMessage='+date;
                    }else{
                      sqlQueryChat='INSERT INTO 22_DB_Gruppe3.chat SET fk_personid='+userid+', fk_wgid='+req.body.body.idToMatch+', lastMessage='+date;
                    }
    
                    console.log("Add Chat!!: " + sqlQueryChat);
                    con.query(sqlQueryChat, function (error1, results, fields) {
                      if (error1) 
                        console.log(error1)
                      console.log("chat added?");
                      console.log(results);
    
                      
                    });
                    
                    console.log(results);
                    res.send({match: true});
                    
                    con.end(function (error) {
                      if (error) throw error;
                      console.log("connection End");
                    });
                    
                  });
    
                }  
              });           

            }else{

              //gibt es schon einen Eintrag in der DB
              con.query(sqlQuery0, function (error, results, fields) {
                if (results[0].countMatches == 0) {

                  console.log(sqlQuery2)
                  con.query(sqlQuery2, function (error, results, fields) {
                    console.log(results);
                    res.send(stringify(results));

                    con.end(function (error) {
                      if (error) throw error;
                      console.log("connection End");
                    });
                  });
                }else{
                  con.query(sqlQuery3, function (error, results, fields) {
                    console.log(results);
                    con.end(function (error) {
                      if (error) throw error;
                      console.log("connection End");
                    });
                  });
                }
              });

            }

            //con.end(function (error) {
            //  if (error) throw error;
            //  console.log("connection End");
            //});
          //});
        });
    });




      //Upload photos for profiles
    app.post('/uploadProfilePic', verifyToken, function (req, res) {

      var userid = [req.userId];
      

      var con = mysql.createConnection(conConfig);

      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          console.log(files.file)
          var oldpath = files.file.filepath;
          console.log(oldpath)
          var newpath = 'src/assets/'+userid+'/' //+ files.file.originalFilename;
          console.log(newpath)
  
          fs.mkdir(newpath, err => { 
            //if (err) throw err;
            var dateiEndung = files.file.originalFilename;
            if(dateiEndung.endsWith("jpg")){
              dateiEndung = ".jpg"
            }
            if(dateiEndung.endsWith("png")){
              dateiEndung = ".png"
            }
            if(dateiEndung.endsWith("jpeg")){
              dateiEndung = ".jpeg"
            }
            if(dateiEndung.endsWith("svg")){
              dateiEndung = ".svg"
            }
            if(dateiEndung.endsWith("img")){
              dateiEndung = ".img"
            }
            newpath = 'src/assets/'+userid+'/Profilepic' + dateiEndung;

            // options is optional
            glob('src/assets/'+userid+'/Profilepic**', {}, function (er, files) {
              for (const file of files) {
                console.log("GLOB:");
                console.log(file);
                fs.unlinkSync(file);
              }

              fs.rename(oldpath, newpath, function (err) {

                newpath = 'assets/'+userid+'/' + 'Profilepic' + dateiEndung;
                var sqlQuery = 'UPDATE 22_DB_Gruppe3.users SET profilepic="'+newpath +'" WHERE userid='+userid+';';
  
                con.query(sqlQuery, function (error1, results, fields) {
                  if (error1) 
                    console.log(error1)
                  console.log("profilepic set in users");
                  console.log(results);

                  res.send(stringify(results));
  
                  con.end(function (error) {
                    if (error) throw error;
                    console.log("connection End");
                  });
                });
              });
            })          
          }); 
        });
      });
    });


  // application -------------------------------------------------------------
 app.get('/', function(req,res) 
 {     
       //res.send("Hello World123");     
       res.sendFile('index.html', { root: __dirname+'/dist/my-new-angular-app' });    //TODO rename to your app-name
 });
 

 // listen (start app with node server.js) ======================================

app.listen(8080, function () {
      console.log("App listening on port 8080");
      console.log("Server started");
    });
    