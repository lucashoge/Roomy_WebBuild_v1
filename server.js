 // set up ======================== 
 var express  = require('express'); 
 var app      = express();                               // create our app w/ express 
 var path     = require('path'); 
 var mysql    = require('mysql'); 
 var stringify = require('json-stringify-safe');
  
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
app.use(express.static(path.join(__dirname, '/dist/my-new-angular-app')));

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



//Middleware -----------------------------------------------------------
function verifyToken(req, res, next) {
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
  else {
    req.userId = payload.sub;
    next();
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

});

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



//Registrieren Neuen User in die Datenbank eintragen
app.post('/register', function (req, res) {
  console.log("Start");
  console.log(req.body);
  if(req.body.body.kindOfUser=='person'){
    console.log("Person");
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
  }
  else if(req.body.body.kindOfUser=='wg'){
    console.log("WG");
    //WG
    var con = mysql.createConnection(conConfig);    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('INSERT INTO users SET ?;INSERT INTO wg(wgid)  select MAX(userid) as newid FROM users; UPDATE wg SET ? where wgid = (SELECT MAX(userid) FROM users); ', [{ username: req.body.body.Username, email: req.body.body.Email, password: req.body.body.Passwort },{ wgname: req.body.body.WGName, postcode: req.body.body.Postleitzahl, city: req.body.body.Stadt, country: req.body.body.Land }],
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
  }
      
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


  app.post('/allChatsFromPerson', function (req, res) {

    var con = mysql.createConnection(conConfig);
  
      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");
        con.query('SELECT 22_DB_Gruppe3.chat.chatid,22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid,22_DB_Gruppe3.chat.fk_wgid, userTable.email AS userMail, wgTable.email AS wgMail FROM 22_DB_Gruppe3.chat LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid WHERE userTable.email="' + req.body.body.email +'" OR wgTable.email="' + req.body.body.email +'"',
          function (error, results, fields) {
            if (error) throw error;
            console.log(req.body.body.email);
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

    app.post('/submitChatMessage', function (req, res) {

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('INSERT INTO 22_DB_Gruppe3.chateintrag SET ?', [{ msgDate: req.body.body.msgDate, msgText: req.body.body.msgText, from_id: req.body.body.from_id, chatid: req.body.body.chatid,}],
            function (error, results, fields) {
              if (error) throw error;
              console.log(req.body.body.msgText);
              console.log(results);
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

    app.post('/getMatchesByMail', function (req, res) {

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT 22_DB_Gruppe3.match.fk_personid, 22_DB_Gruppe3.match.fk_wgid, 22_DB_Gruppe3.match.wgmatch, 22_DB_Gruppe3.match.personmatch,userTable.email AS userMail, wgTable.email AS wgMail'
            + ' FROM 22_DB_Gruppe3.match'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid'
            + ' WHERE (userTable.email="' + req.body.body.email + '" OR wgTable.email="' + req.body.body.email + '") AND (22_DB_Gruppe3.match.wgmatch=1 AND 22_DB_Gruppe3.match.personmatch=1)';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(req.body.body.email);
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

    app.post('/getPossiblePersonMatchesByMail', function (req, res) {

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT *'
            + ' FROM 22_DB_Gruppe3.match'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid'
            + ' WHERE userTable.email="' + req.body.body.email + '" AND (22_DB_Gruppe3.match.wgmatch=1 AND 22_DB_Gruppe3.match.personmatch=0)';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(req.body.body.email);
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

    app.post('/getPossibleWgMatchesByMail', function (req, res) {

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT *'
            + ' FROM 22_DB_Gruppe3.match'
            + ' LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_wgid=userTable.userid'
            + ' WHERE userTable.email="' + req.body.body.email + '" AND (22_DB_Gruppe3.match.wgmatch=0 AND 22_DB_Gruppe3.match.personmatch=1)';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(req.body.body.email);
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

    app.post('/getUsersFromIdUpwards', function (req, res) {

      var userType = "";
      var limit = req.body.body.limit;
      var minUserID = req.body.body.userId;

      if(req.body.body.usertype == "wg"){
        userType = "person";
      }else{
        userType = "wg";
      }

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          var sqlQuery = 'SELECT * FROM 22_DB_Gruppe3.users'
          + ' LEFT JOIN 22_DB_Gruppe3.person AS personTable ON userid=personTable.personid'
          + ' WHERE usertype="' + userType + '" AND userid>' + minUserID
          + ' limit ' + limit + ';';

          con.query(sqlQuery,
            function (error, results, fields) {
              if (error) throw error;
              console.log(req.body.body.email);
              console.log(results);
              res.send(stringify(results));
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
    