 // set up ======================== 
 var express  = require('express'); 
 var app      = express();                               // create our app w/ express 
 var path     = require('path'); 
 var mysql    = require('mysql'); 
 var stringify = require('json-stringify-safe');
  
 bodyParser = require('body-parser');
 
 
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
      password: "Ll12Z2>ftt-]hr>LU4uz"
    };






//Ist vom alten Projekt, muss noch angepasst werden
//Registrieren Neuen User in die Datenbank eintragen
app.post('/register', function (req, res) {

      var con = mysql.createConnection(conConfig);
    
        con.connect(function (error) {
          if (error) throw error;
          console.log("connected");
          con.query('INSERT INTO users SET ? ', { username: req.body.body.Username, email: req.body.body.Email, nachname: req.body.body.Nachname, vorname: req.body.body.Name, passwort: req.body.body.Passwort },
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              con.end(function (error) {
                if (error) throw error;
                console.log("connection End");
              });
            });
        });
    });




  // get all chats of a person:
  /*
  *
    SELECT 22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid,22_DB_Gruppe3.chat.fk_wgid, userTable.email AS userMail, wgTable.email AS wgMail
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
        con.query('SELECT 22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid,22_DB_Gruppe3.chat.fk_wgid, userTable.email AS userMail, wgTable.email AS wgMail FROM 22_DB_Gruppe3.chat LEFT JOIN 22_DB_Gruppe3.users AS userTable ON fk_personid=userTable.userid LEFT JOIN 22_DB_Gruppe3.users AS wgTable ON fk_wgid=wgTable.userid WHERE userTable.email="' + req.body.body.email +'" OR wgTable.email="' + req.body.body.email +'"',
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
    