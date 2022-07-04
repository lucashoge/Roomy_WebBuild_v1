 // set up ======================== 
 var express  = require('express'); 
 var app      = express();                               // create our app w/ express 
 var path     = require('path'); 
 var mysql    = require('mysql'); 
  
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
    SELECT 22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid, 22_DB_Gruppe3.chat.fk_wgid, 22_DB_Gruppe3.users.email FROM 22_DB_Gruppe3.chat
    INNER JOIN 22_DB_Gruppe3.users ON 22_DB_Gruppe3.chat.fk_personid=22_DB_Gruppe3.users.userid
    WHERE email="testPerson2@gmail.com" ORDER BY lastMessage
   */


  app.post('/allChatsFromPerson', function (req, res) {

    var con = mysql.createConnection(conConfig);
  
      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");
        con.query('SELECT 22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid, 22_DB_Gruppe3.chat.fk_wgid, 22_DB_Gruppe3.users.email FROM 22_DB_Gruppe3.chat INNER JOIN 22_DB_Gruppe3.users ON 22_DB_Gruppe3.chat.fk_personid=22_DB_Gruppe3.users.userid WHERE email=' + req.body.body.Email + 'ORDER BY lastMessage',
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

// get all chats of a wg:
  /*
  *
    SELECT 22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid, 22_DB_Gruppe3.chat.fk_wgid, 22_DB_Gruppe3.users.email FROM 22_DB_Gruppe3.chat
    INNER JOIN 22_DB_Gruppe3.users ON 22_DB_Gruppe3.chat.fk_wgid=22_DB_Gruppe3.users.userid
    WHERE email="testPerson2@gmail.com" ORDER BY lastMessage
   */
  app.post('/allChatsFromWG', function (req, res) {

    var con = mysql.createConnection(conConfig);
  
      con.connect(function (error) {
        if (error) throw error;
        console.log("connected");
        con.query('SELECT 22_DB_Gruppe3.chat.lastMessage, 22_DB_Gruppe3.chat.fk_personid, 22_DB_Gruppe3.chat.fk_wgid, 22_DB_Gruppe3.users.email FROM 22_DB_Gruppe3.chat INNER JOIN 22_DB_Gruppe3.users ON 22_DB_Gruppe3.chat.fk_wgid=22_DB_Gruppe3.users.userid WHERE email=' + req.body.body.Email + 'ORDER BY lastMessage',
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
    