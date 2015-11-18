var express = require("express");

var app = express();
var sqlite3 = require('sqlite3').verbose();
var http = require("http");
var fs = require("fs");
var ejs = require("ejs");
var bodyParser = require('body-parser');

var maindir = "../";

var userModel = require(maindir + "/models/User");
var msgModel = require(maindir + "/models/Message");

var server = http.createServer(app);
var db = new sqlite3.Database('./SSNOC.DB');

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var allUsers = [];


//Ping Method:
app.get("/ping/:val", function(req, res)
{
	res.send("Rest services are up and running... Returning sent value: " + req.params.val);
});


//Join Community Methods:
app.get("/users", function(req, res)
{
  console.log("Calling users REST method...");

  userModel.getAllUsers(function(err, users) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(users));    
  });
});


app.get("/user/logout/:username", function(req, res)
{
  console.log("Calling logout REST method...");

  var sentUsername = req.params.username;

	userModel.logout(sentUsername, function(err, logoutInfo)
  {
    console.log("returned status: " + logoutInfo.status);

    if (err)
      res.sendStatus(500);
    else
      res.send(logoutInfo.status); 
  });
});

app.get("/user/:username", function(req, res)
{
  console.log("Calling user REST method...");

  var sentUsername = req.params.username;

  userModel.getSingleUser(sentUsername, function(err, user) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(user));    
  });
});


app.post("/user/signup/:username", function(req, res)
{
  console.log("Calling signup REST method...");

  userModel.signup(req.params.username, req.body.password, req.body.createdat, function(err, signupInfo)
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(signupInfo.status); 
  });
});


app.post("/user/login/:username", function(req, res)
{
  console.log("Calling login REST method...");

  userModel.login(req.params.username, req.body.password, req.body.lastloginat, function(err, loginInfo)
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(loginInfo.status); 
  });
});

//Share Status Methods:
app.post("/updatestatus/:username", function(req, res)
{
  console.log("Calling updatestatus REST method...");

  userModel.updateStatus(req.params.username, req.body.status, req.body.updatedat, function(err, status)
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(status); 
  });
});

app.get("/statuses/:username", function(req, res)
{
  console.log("Calling statuses REST method...");

  userModel.getAllUserStatuses(req.params.username, function(err, statuses) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(statuses));    
  });
});

app.get("/messages/announcement", function(req, res)
{
  console.log("Calling announcements REST method...");

  msgModel.getAllMsgs("announcement", function(err, announcementList) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(announcementList));    
  });
});

app.post("/message/announcement/:username", function(req, res)
{
  console.log("Calling statuses REST method...");

  msgModel.saveMsg("announcement", req.params.username, req.body.message, req.body.datetime, function(err, status) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.sendStatus(status);    
  });
});

app.post("/message/:username/:receiver", function(req, res)
{
  console.log("Calling msg REST method...");
  var statement;
  msgModel.savePrivateMsg("privatemsg", req.params.username, req.params.receiver, req.body.message, req.body.datetime, req.body.status,function(err, status) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(statement));   
  });
});

app.get("/messages/:username/:receiver", function(req, res)
{
  console.log("Calling announcements REST method...");
var msgList = [];
  msgModel.getPrivateMsgs("privatemsg", function(err, msgList) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(msgList));    
  });
});


app.get("/messages/wall", function(req, res)
{
  console.log("Calling wall REST method...");

  msgModel.getMsgs("publicmsg", function(err, msgList) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.send(JSON.stringify(msgList));    
  });
});

app.post("/message/wall/:username", function(req, res)
{
  console.log("Calling wall REST method...");
var statement;
  msgModel.saveAllMsg("publicmsg", req.params.username, req.body.message, req.body.datetime, req.body.status,function(err, status) 
  {
    if (err)
      res.sendStatus(500);
    else
      res.sendStatus(statement);    
  });
});


server.listen(7777);
console.log("Rest Server is up and running. Listening on port 7777...");
