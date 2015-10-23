/* ------------------------------------*
 *          include libraries 
 * ------------------------------------*/
var express = require('express');
var bodyParser = require('body-parser');
var bCrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./SSNOC.DB');

//partials
var partials = require('express-partials')
var app = express();

var maindir = "../";

var userModel = require(maindir + "/models/User");
var msgModel = require(maindir + "/models/Message");

//----@Joan
//problem in sending receiver

app.param('receiver', function (req, res, next, value) {

    // try to get the user details from the User model and attach it to the request object
    console.log("receiver for private chat: " + value);
    req.receiver = value;
    next();

});

//@Joan----

app.set('port', process.env.PORT || 8888);
app.set('views', maindir + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'ssshhh', resave: true, saveUninitialized: true}));

//partials
app.use(partials());

var server = require('http').createServer(app);
app.use(express.static(maindir + '/public'));
var io = require('socket.io').listen(server);

//app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));

//reset all users to offline if server crashes
/*userModel.resetUserstatus(function(err, status)
 {
 if(err)
 {
 res.sendStatus(500);
 }

 });
 //db.run('UPDATE USER SET ISONLINE = 0');//gkishore: set all users to offline when node server stops

 */

app.get('/index', function (req, res) {
    console.log("calling index - GET");
    res.render('login', {pagemsg: 'Welcome to the SSNoC'});
});

app.get('/', function (req, res) {

    res.redirect('/index');

});

app.post('/login', function (req, res) {
    console.log("calling login - POST");
    userModel.login(req.body.username, req.body.password, req.body.lastloginat, function (err, loginInfo) {
        var pagename = loginInfo.pagename;
        var pagemsg = loginInfo.pagemsg;

        if (pagename === "signup")
            res.render(maindir + '/views/signup', {pagemsg: pagemsg});

        else if (pagename === "welcomepage") {
            req.session.username = req.body.username;
            res.render(maindir + '/views/welcomepage', {username: req.body.username});
        }
        if (err)
            res.sendStatus(500);
    });
});

app.post('/signup', function (req, res) {
    console.log("calling signup - POST");

    userModel.signup(req.body.username, req.body.password, req.body.createdat, function (err, signupInfo) {
        //console.log("returned status: " + status);

        var pagename = signupInfo.pagename;
        var pagemsg = signupInfo.pagemsg;

        if (pagename === "signup")
            res.render(maindir + '/views/signup', {pagemsg: pagemsg});

        else if (pagename === "welcomepage") {
            req.session.username = req.body.username;
            res.render(maindir + '/views/welcomepage', {username: req.body.username});
        }
        if (err)
            res.sendStatus(500);
    });
});

app.post('/status', function (req, res) {
    console.log("Got status [" + req.body.status + "] from [" + req.session.username + "] at [" + req.body.updatedat + "]");

    if (req.session.username !== undefined) {
        userModel.updateStatus(req.session.username, req.body.status, req.body.updatedat, function (err, status) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});

app.get('/directory', function (req, res)//gkishore: code for directory
{

    if (req.session.username !== undefined) {
        userModel.getAllUsers(function (err, userList) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.render('directory', {username: req.session.username, userList: userList});
            }

        });
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});


//public
app.get('/chatroom', function (req, res) {

    if (req.session.username !== undefined) {
        if (req.query.receiver === undefined) {
            res.render('chatroom', {username: req.session.username, receiver: "All"});
        } else {
            var receiver = req.query.receiver;
            console.log("receiver:" + receiver);
            res.render('chatroom', {username: req.session.username, receiver: receiver})
        }
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});




//@Joan----

app.get('/announcements', function (req, res)//gkishore: code for announcements
{

    if (req.session.username !== undefined) {

        res.render('announcements', {username: req.session.username});
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});

app.get('/welcomepage', function (req, res)//gkishore: code for accessing home page from nav bar
{

    if (req.session.username !== undefined) {

        res.render('welcomepage', {username: req.session.username});
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});


app.get('/logout', function (req, res)// gkishore: app.post changed to app.get
{
    userModel.logout(req.session.username, function (err, logoutInfo) {
        var pagename = logoutInfo.pagename;
        var pagemsg = logoutInfo.pagemsg;

        if (err) {
            res.sendStatus(500);
        }
        else {
            req.session.destroy(function (err)//gkishore: destroy cookies on logout
            {
                if (err) {
                    console.log(err);
                }
                else if (pagename === 'login') {
                    res.render(maindir + '/views/login', {pagemsg: 'Thanks for visiting SSNoC...Stay safe!'});
                }
            });
        }

    });
});

//@Joan----
//Chat Publicly code
//problem part of users definition

io.on("connection", function (client) {
    console.log("on connection 1234...");

    //Getting all public msgs
     msgModel.getMsgs("publicmsg", function (err, msgList)
     {
     if(err)
     {
     res.sendStatus(500);
     }
     else //if(receiver === "All")       //receiver undified?
     {
     for(var i=0; i<msgList.length; i++)
     {
     var msgInfo = msgList[i];

     var username = msgInfo.username;
     var message = msgInfo.message;
     var datetime = msgInfo.datetime;
     var receiver = msgInfo.receiver;
     if (receiver === "All") {
     client.broadcast.emit("messages", {username:username, message: message, datetime: datetime, receiver:"All"});
     }else{client.emit("messages", {username:username, message: message, datetime: datetime, receiver:receiver});
}

     }
     }
     });

//Getting  private msgs
    /* msgModel.getPrivateMsgs("privatemsg", function (err, msgList)
     {
     if(err)
     {
     res.sendStatus(500);
     }
     else
     {
     for(var i=0; i<msgList.length; i++)
     {
     var msgInfo = msgList[i];

     var username = msgInfo.username;
     var message = msgInfo.message;
     var datetime = msgInfo.datetime;
     var receiver = msgInfo.receiver;
     client.emit("messages", {username:username, message: message, datetime: datetime, receiver:receiver});
     }
     }
     });
*/

    //Getting all announcements
     msgModel.getMsgs("announcement", function (err, announcementList)
     {
     if(err)
     {
     res.sendStatus(500);
     }
     else
     {
     for(var i=0; i<announcementList.length; i++)
     {
     var announcementInfo = announcementList[i];

     var username = announcementInfo.username;
     var message = announcementInfo.message;
     var datetime = announcementInfo.datetime;
     client.emit("announcements", {username:username, message: message, datetime: datetime});
     }
     }
     });
//
    client.on("messages", function (data) {
        console.log("on incomingMessage...");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;
        //Joan
        var receiver = data.receiver;
        console.log("username:........" + username);
        console.log("receiver:........" + receiver);

        //console.log(username + " ,"  + message + " ," + datetime);
        client.broadcast.emit("messages", data);//无论公聊私聊都广播发

        if(receiver==="All"){
         msgModel.saveAllMsg("publicmsg", username, message, datetime, function (err, status){});
         
         }else{
         msgModel.savePrivateMsg("privatemsg", username, receiver, message, datetime, function (err, status){});

         }

    });

    client.on("announcements", function (data) {
        console.log("on incomingAnnouncement...");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;

        console.log(username + " ," + message + " ," + datetime);

        client.broadcast.emit("announcements", {username: username, message: message, datetime: datetime});

        msgModel.saveAllMsg("announcement", username, message, datetime, function (err, status) {
        });
    });

});

server.listen(app.get('port'));
console.log("App Server is up and running. Listening on port 8888:");
