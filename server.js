 // set up ======================== 
 var express  = require('express'); 
 var app      = express();                               // create our app w/ express 
 var path     = require('path'); 
 bodyParser = require('body-parser');
 const { ArgumentOutOfRangeError } = require('rxjs');
var mysql = require('mysql');
var stringify = require('json-stringify-safe');
var jwt = require('jsonwebtoken');
var fs = require("fs");

// configuration =================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.static(path.join(__dirname, '/dist/angular-microblog')));

const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');
 
 
 // support parsing of application/json type post data
 app.use(bodyParser.json());
 
 //support parsing of application/x-www-form-urlencoded post data
 app.use(bodyParser.urlencoded({ extended: true }));
 
  // configuration =================
 app.use(express.static(path.join(__dirname, '/dist/my-new-angular-app')));  //TODO rename to your app-name



// MySQL connection =============

var conConfig = {
      database: "22_DB_Gruppe3",
      host: "195.37.176.178",
      port: "20133",
      user: "22_DB_Grp_3",
      password: "Ll12Z2>ftt-]hr>LU4uz",
      multipleStatements: true
    };




//Register Abfrage ob Username+Email bereits existieren (Unfertig -> ausbauen)
app.get('/register', function (req, res) {

  var con = mysql.createConnection(conConfig);
  var username;
  console.log("Got it");
  con.connect(function (error) {
    if (error) throw error;
    console.log("connected");
    //console.log("Username: " + req.query.Username);

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
  
});

//Ist vom alten Projekt, muss noch angepasst werden
//Registrieren Neuen User in die Datenbank eintragen
app.post('/register', function (req, res) {
      //Person
      var con = mysql.createConnection(conConfig);    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('INSERT INTO users SET ?;INSERT INTO person(personid)  select MAX(userid) as newid FROM users; UPDATE person SET ? where personid = (SELECT MAX(userid) FROM users); ', [{ username: req.body.body.Username, email: req.body.body.Email, password: req.body.body.Passwort },{ firstname: req.body.body.Vorname, surname: req.body.body.Nachname, gender: req.body.body.Geschlecht, birthdate: req.body.body.Geburtsdatum }],
          //con.query('INSERT INTO person SET ?; INSERT INTO users SET ? ', [{ personid: 'SELECT userid FROM users WHERE userid=LAST_INSERT_ID()', firstname: req.body.body.Vorname, surname: req.body.body.Nachname, gender: req.body.body.Geschlecht, birthdate: req.body.body.Geburtsdatum },{ username: req.body.body.Username, email: req.body.body.Email, password: req.body.body.Passwort }],
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
    