var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../controllers/SSNOC.DB');
var bCrypt = require('bcrypt-nodejs');

function User(username, password,isAdmin)
{
  this.local =
  {
    username : username,
    password : password,
    //fullName  : fullName,
    //location : location,
    isAdmin : isAdmin
  };
}


User.getSingleUser = function(sentUsername, callback)
{
    console.log("Getting the User info for the user with name: " + sentUsername);

    var user = {};

    db.all("SELECT USERNAME, ISADMIN, ISONLINE, CREATEDAT, LASTLOGINAT FROM USER WHERE USERNAME ='" + sentUsername + "'", function(err, rows) 
    {  
      if(rows !== undefined)
      {
        rows.forEach(function (row) 
        {
          var username = row.USERNAME;
          //var location = row.LOCATION;
          var isAdmin = row.ISADMIN;
          var isOnline = row.ISONLINE;
          var createdAt = row.CREATEDAT;
          var lastloginat = row.LASTLOGINAT;

          user.username = username;
          //user.location = location;
          user.isadmin = isAdmin
          user.isonline = isOnline;
          user.createdat = createdAt;
          user.lastloginat = lastloginat;
        });

        callback(null, user);
      }

      if (err)
        callback(err, null);  
  });
}

User.logout = function(sentUsername, callback)
{
  console.log("Checking if the user is logged in---: " + sentUsername);

  var logoutInfo = {};

  db.all("SELECT ISONLINE FROM USER WHERE USERNAME ='" + sentUsername + "'", function(err, rows) 
  {  
    if(rows !== undefined)
    {
      rows.forEach(function (row) 
      {
          var isOnline = row.ISONLINE;

          if(isOnline === 1)
          {
            console.log("login page");
            logoutInfo.pagename = "login";
            logoutInfo.pagemsg = "Thank you for visiting. Stay safe!";
            logoutInfo.status = 200;//RESTful
            db.run("UPDATE USER SET ISONLINE = ? WHERE USERNAME = ?", [0, sentUsername]);
          }
          else if(isOnline === 0)
          {
            console.log("zero");
            logoutInfo.status = 400;
          }
            
      });

      callback(null, logoutInfo);
    }

    if (err)
      callback(err, null);  
  });
}


User.signup = function(sentUsername, sentPassword, sentCreatedAt, callback)
{
  console.log("Signing up: ");

  console.log("sentUsername " + sentUsername);
  console.log("sentPassword " + sentPassword);
  console.log("sentCreatedAt " + sentCreatedAt);
  
  var signupInfo = {};
      
  db.all("SELECT USERNAME FROM USER WHERE USERNAME='" + sentUsername + "'", function(err, rows) 
  {  
    console.log("rows: " + rows.length);
    if(rows !== undefined) 
    {
        if(rows.length > 0) //Existing User
        {
          console.log("old user");

          signupInfo.pagename = "signup";
          signupInfo.pagemsg = "Username already taken. Please choose another one.";
          signupInfo.status = 200;

          callback(null, signupInfo);
        }
        else //New User
        {
          console.log("new user");

          db.serialize(function()
          {  
            var stmt = db.prepare("INSERT INTO USER (USERNAME, PASSWORD, ISADMIN, ISONLINE, STATUS, CREATEDAT, LASTLOGINAT) VALUES (?,?,?,?,?,?,?)");
            stmt.run(sentUsername, createHash(sentPassword), 0, 1, 'ND', sentCreatedAt, sentCreatedAt);
            stmt.finalize();
          });

          signupInfo.pagename = "welcomepage";
          //signupInfo.pagemsg = "Username already taken. Please choose another one.";
          signupInfo.user = sentUsername;
          signupInfo.status = 201;

          callback(null, signupInfo);
        }
    }


    if (err)
      callback(err, null);
  });
}


User.login = function(sentUsername, sentPassword, lastloginat, callback)
{
  console.log("Logging in: ");
  var loginInfo = {};
      
  db.all("SELECT USERNAME, PASSWORD FROM USER WHERE USERNAME='" + sentUsername + "'", function(err, rows) 
  {  
    console.log("rows: " + rows.length);
    if(rows !== undefined) 
    {
        if(rows.length > 0) //Existing User
        {
          console.log("old user");
          rows.forEach(function (row) 
          {
            var password = row.PASSWORD;
            console.log("password " + password);
            if(checkPassword(sentPassword, row.PASSWORD)) //correct password
            {
              console.log("correct pwd");
              loginInfo.pagename = "welcomepage";
              //loginInfo.pagemsg = "Username already taken. Please choose another one.";
              loginInfo.status = 200;

              //update lastloginat
              db.run("UPDATE USER SET ISONLINE = ? WHERE USERNAME = ?", [1, sentUsername]);
              db.run("UPDATE USER SET LASTLOGINAT = ? WHERE USERNAME = ?", [lastloginat, sentUsername]);
            }
            else //wrong password
            {
              console.log("wrong pwd");
              loginInfo.pagename = "signup";
              loginInfo.pagemsg = "User does not exist. Please sign up.";
              loginInfo.status = 401;
            }
          });
          callback(null, loginInfo);
        }
        else //User not found
        {
          console.log("user not found");

          loginInfo.pagename = "signup";
          loginInfo.pagemsg = "User does not exist. Please sign up.";
          loginInfo.status = 404;

          callback(null, loginInfo);
        }
    }

    if (err)
      callback(err, null);
  });
}


User.getAllUsers = function(callback)//gkishore: code for directory access
{
  var userList = [];
  console.log("Getting directory list...");
  db.all("SELECT USERNAME, ISADMIN, ISONLINE, STATUS, STATUSDATETIME, CREATEDAT, LASTLOGINAT FROM USER ORDER BY ISONLINE DESC, USERNAME ASC", function(err, rows)
  {
    if(rows!== undefined)
    {
      rows.forEach(function (row)
      {
        var userInfo = {};
        userInfo.username = row.USERNAME;
        userInfo.isAdmin = row.ISADMIN;
        userInfo.isOnline = row.ISONLINE;
        userInfo.status = row.STATUS;
        userInfo.statusTime = row.STATUSDATETIME;
        userInfo.createdAt = row.CREATEDAT;
        userInfo.lastLoginAt = row.LASTLOGINAT;
        console.log("row name: "+ row.USERNAME+"online: "+ row.ISONLINE);
        userList.push(userInfo);
      });

      callback(null, userList);
    }
    if (err)
      callback(err, null);
  });
  userList = [];
}

User.updateStatus = function(sentUsername, sentStatusCode, updatedAt, callback)
{
  console.log("Updating status---: " + sentUsername);

  var status = '';

  db.all("SELECT USERNAME FROM USER WHERE USERNAME ='" + sentUsername + "'", function(err, rows) 
  {  
    if(rows !== undefined)
    {
      if(rows.length > 0) //Existing User
      {
        rows.forEach(function (row) 
        {
            db.run("UPDATE USER SET STATUS = ? , STATUSDATETIME = ? WHERE USERNAME = ?", [sentStatusCode, updatedAt, sentUsername]);

            db.serialize(function()
            {  
              var stmt = db.prepare("INSERT INTO USERSTATUSHISTORY (ID, USERNAME, STATUS, UPDATEDAT) VALUES (?,?,?,?)");
              stmt.run(null, sentUsername, sentStatusCode, updatedAt);
              stmt.finalize();
            });

        });
        status = 201;
     }
     else //User Not Found
     {
        status = 404;
     }
     
     callback(null, status);
    }

    if (err)
      callback(err, null);  
  });
}

User.getAllUserStatuses = function(sentUsername, callback)
{
  var userStatusList = [];
  console.log("Getting user status list...");
  db.all("SELECT USERNAME, STATUS, UPDATEDAT FROM USERSTATUSHISTORY WHERE USERNAME ='" + sentUsername + "'", function(err, rows)
  {
    if(rows!== undefined)
    {
      rows.forEach(function (row)
      {
        var userStatusInfo = {};
        userStatusInfo.username = row.USERNAME;
        userStatusInfo.status = row.STATUS;
        userStatusInfo.updatedAt = row.UPDATEDAT;

        userStatusList.push(userStatusInfo);
      });

      callback(null, userStatusList);
    }
    if (err)
      callback(err, null);
  });
  userStatusList = [];
}


//Utils
var createHash = function(password)
{
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var checkPassword = function(sentpassword, dbpassword)
{
  return bCrypt.compareSync(sentpassword, dbpassword);
}

module.exports = User;