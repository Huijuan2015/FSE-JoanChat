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

app.set('port', process.env.PORT || 8888);
app.set('views', maindir + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'ssshhh', resave: true, saveUninitialized: true}));
app.use(partials());//partials

var server = require('http').createServer(app);
app.use(express.static(maindir + '/public'));
var io = require('socket.io').listen(server);


/* ------------------------------------*
 *          sending receiver 
 * ------------------------------------*/

app.param('receiver', function (req, res, next, value) {

    // try to get the user details from the User model and attach it to the request object
    console.log("receiver for private chat is: ..." + value);
    req.receiver = value;
    next();

});

/* ------------------------------------*
 *          Login site 
 * ------------------------------------*/

app.get('/index', function (req, res) {
    console.log("calling index - GET");
    res.render('login', {pagemsg: 'Welcome to the SSNoC'});
});

app.get('/', function (req, res) {

    res.redirect('/index');

});

/* ------------------------------------*
 *             POST Login 
 * ------------------------------------*/

app.post('/login', function (req, res) {
    console.log("calling login - POST");
    userModel.login(req.body.username, req.body.password, req.body.lastloginat, function (err, loginInfo) {
        var pagename = loginInfo.pagename;
        var pagemsg = loginInfo.pagemsg;

        if (pagename === "signup")
            res.render(maindir + '/views/signup', {pagemsg: pagemsg});

        else if (pagename === "welcomepage") {
            req.session.username = req.body.username;
            res.redirect('/mainpage?'+'username='+ req.body.username);
        }
        if (err)
            res.sendStatus(500);
    });
});

/* ------------------------------------*
 *          POST Sign up 
 * ------------------------------------*/

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
            res.redirect('/mainpage?'+'username='+ req.body.username); }
        if (err)
            res.sendStatus(500);
    });
});

/* ------------------------------------*
 *          POST Status
 * ------------------------------------*/

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

/* ------------------------------------*
 *          GET directory 
 * ------------------------------------*/

app.get('/directory', function (req, res)
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

/* ------------------------------------*
 *   GET chatroom - public & private 
 * ------------------------------------*/

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

/* ------------------------------------*
 *         GET announcements 
 * ------------------------------------*/

app.get('/announcements', function (req, res)
{

    if (req.session.username !== undefined) {

        res.render('announcements', {username: req.session.username});
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});

/* ------------------------------------*
 *      GET welcome page & nav bar
 * ------------------------------------*/

app.get('/welcomepage', function (req, res)
{

    if (req.session.username !== undefined) {

        res.render('welcomepage', {username: req.session.username});
    }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});

/* ------------------------------------*
 *       GET mainpage
 * ------------------------------------*/

app.get('/mainpage', function (req, res)//gkishore: code for accessing home page from nav bar
{

        if (req.session.username !== undefined) {
            userModel.getAllUsers(function (err, userList) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    res.render('mainpage', {username: req.session.username, receiver: "All",userList: userList});
                }

            });

        }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});

/* ------------------------------------*
 *           GET log out
 * ------------------------------------*/

app.get('/logout', function (req, res)// gkishore: app.post changed to app.get
{
    var logoutat = getTimer(new Date());
    console.log("logout.........."+logoutat);
    userModel.logout(req.session.username,logoutat, function (err, logoutInfo) {
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

/* ------------------------------------*
 *             get timer
 * ------------------------------------*/

function getTimer()
{
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var day= (date.getDate()).toString();
    var month = (date.getMonth()+1).toString();
    var year = (date.getFullYear()).toString();
    var fullDate = year+'-'+month+'-'+day+' '+hr+':'+min;
    console.log("fullDate: " +fullDate);
    return fullDate;
}

/* ------------------------------------*
 *          receive Msg
 * ------------------------------------*/

io.on("connection", function (client) {
    console.log("on connection ...");

/* ------------------------------------*
 *          get all public Msg
 * ------------------------------------*/

    msgModel.getMsgs("publicmsg", function (err, msgList) {
        if (err) {
            res.sendStatus(500);
        }
        else
        {
            for (var i = 0; i < msgList.length; i++) {
                var msgInfo = msgList[i];

                var username = msgInfo.username;
                var message = msgInfo.message;
                var datetime = msgInfo.datetime;
                client.emit("messages", {username: username, message: message, datetime: datetime, receiver: "All"});
            }
        }
    });

/* ------------------------------------*
 *          get all private Msg
 * ------------------------------------*/

    msgModel.getPrivateMsgs("privatemsg", function (err, msgList) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            for (var i = 0; i < msgList.length; i++) {
                var msgInfo = msgList[i];

                var username = msgInfo.username;
                var message = msgInfo.message;
                var datetime = msgInfo.datetime;
                var receiver = msgInfo.receiver;
                //console.log("getting private msg from "+ username+"message: "+ message+"receiver: "+receiver);

                client.emit("messages", {username: username, message: message, datetime: datetime, receiver: receiver});
            }
        }
    });

/* ------------------------------------*
 *          get all announcements
 * ------------------------------------*/

    msgModel.getMsgs("announcement", function (err, announcementList) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            for (var i = 0; i < announcementList.length; i++) {
                var announcementInfo = announcementList[i];
                var username = announcementInfo.username;
                var message = announcementInfo.message;
                var datetime = announcementInfo.datetime;
                client.emit("announcements", {username: username, message: message, datetime: datetime});
            }
        }
    });

/* ------------------------------------*
 *          Send Msg
 * ------------------------------------*/

    client.on("messages", function (data) {
        console.log("on incomingMsg ...");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;
        //Joan
        var receiver = data.receiver;
        console.log("username: ..." + username);
        console.log("receiver: ..." + receiver);

        client.broadcast.emit("messages", data);//无论公聊私聊都广播发

        if (receiver === "All") {
            msgModel.saveAllMsg("publicmsg", username, message, datetime, function (err, status) {
            });
        } else {
            msgModel.savePrivateMsg("privatemsg", username, receiver, message, datetime, function (err, status) {
            });

        }

    });

/* ------------------------------------*
 *          Send announcement
 * ------------------------------------*/

    client.on("announcements", function (data) {
        console.log("on incomingAnnouncement ...");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;

        console.log("Announcement: ..."+ username + " ," + message + " ," + datetime);

        client.broadcast.emit("announcements", {username: username, message: message, datetime: datetime});

        msgModel.saveAllMsg("announcement", username, message, datetime, function (err, status) {
        });
    });

/* ------------------------------------*
 *          Send status
 * ------------------------------------*/
    //status: selValue, updatedat: getTimer()
    
    client.on("status", function (data) {
        console.log(data.username + "... change status.");
        userModel.updateStatus(data.username, data.status, data.updatedat, function (err, status) {
            if(err){
                console.log("update status err...." + err + "......" + status);
            }
        });
        client.broadcast.emit("status", data);
        console.log("client.broadcast.emit('status', data);");

    });

});


server.listen(app.get('port'));
console.log("App Server is up and running. Listening on port 8888:");