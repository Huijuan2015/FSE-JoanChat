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
var partials = require('express-partials');
var app = express();

var maindir = "../";

var userModel = require(maindir + "/models/User");
var msgModel = require(maindir + "/models/Message");

/* ------------------------------------*
 *          Get value of receiver 
 * ------------------------------------*/

app.param('receiver', function (req, res, next, value) {

    // try to get the user details from the User model and attach it to the request object
    console.log("receiver for private chat: " + value);
    req.receiver = value;
    next();

});

/* ------------------------------------*
 *          sypport files 
 * ------------------------------------*/

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

/* ------------------------------------*
 *             site 
 * ------------------------------------*/

app.get('/index', function (req, res) {
    console.log("calling index - GET");
    res.render('login', {pagemsg: 'Welcome to the SSNoC'});
});

app.get('/', function (req, res) {

    res.redirect('/index');

});

/* ------------------------------------*
 *          Login page
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
 *          Sign up page
 * ------------------------------------*/

app.get('/signup', function (req, res){
    res.render(maindir + '/views/signup');
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
            res.redirect('/mainpage?'+'username='+ req.body.username); }
        if (err)
            res.sendStatus(500);
    });
});

/* ------------------------------------*
 *         main page
 * ------------------------------------*/

app.get('/mainpage', function (req, res)
{

        if (req.session.username !== undefined) {

            userModel.getAllUsers(function (err, userList) {
                var lastLogoutAt;
                for(var i=0 ;i< userList.length;i++){
                    if(userList[i].username===req.session.username){
                        lastLogoutAt=userList[i].lastLogoutAt.replace(' ',"%20");
                        console.log("lastLOgout.....:"+lastLogoutAt);
                        break;
                    }
                }
                if (err) {
                    res.sendStatus(500);
                }
                else {

                    res.render('mainpage', {username: req.session.username, receiver: "All",userList: userList,lastLogOut:lastLogoutAt});
                }

            });

        }
    else {
        res.render('login', {pagemsg: 'Please login!'});
    }

});

/* ------------------------------------*
 *         Logout page
 * ------------------------------------*/

app.get('/logout', function (req, res)
{
    var logoutat = getTimer();
    console.log("logout.........."+logoutat);
    userModel.logout(req.session.username,logoutat, function (err, logoutInfo) {
        var pagename = logoutInfo.pagename;
        var pagemsg = logoutInfo.pagemsg;

        if (err) {
            res.sendStatus(500);
        }
        else {
            req.session.destroy(function (err)//destroy cookies on logout
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
 *       ?? Need for every js file?
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
 *          send msg to front end
 * ------------------------------------*/

io.on("connection", function (client) {
    console.log("on connection 1234...");

    client.on('online', function (data) {
        console.log(data.user +"...........online");
        client.name = data.user;
    });


    //Getting all public msgs
    msgModel.getMsgs("publicmsg", function (err, msgList) {
        if (err) {
           // res.sendStatus(500);
            console.log("getPublic msg error");
        }
        else
        {
            for (var i = 0; i < msgList.length; i++) {
                var msgInfo = msgList[i];

                var username = msgInfo.username;
                var message = msgInfo.message;
                var datetime = msgInfo.datetime;
                var status = msgInfo.status;
                client.emit("messages", {username: username, message: message, datetime: datetime, receiver: "All",status:status});
            }
        }
    });

//Getting  private msgs
    msgModel.getPrivateMsgs("privatemsg", function (err, msgList) {
        if (err) {
            //res.sendStatus(500);
            console.log("getPrivate msg error");
        }
        else {
            for (var i = 0; i < msgList.length; i++) {
                var msgInfo = msgList[i];

                var username = msgInfo.username;
                var message = msgInfo.message;
                var datetime = msgInfo.datetime;
                var receiver = msgInfo.receiver;
                var status = msgInfo.status;
             //   console.log("getting private msg row name: "+ username+"message: "+ message+"receiver: "+receiver+"status:"+status);

                client.emit("messages", {username: username, message: message, datetime: datetime, receiver: receiver,status:status});
            }
        }
    });


    //Getting all announcements
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
                client.emit("announcements", {username: username, annocement: message, datetime: datetime});
            }
        }
    });
//*/
    client.on("messages", function (data) {
        console.log("on incomingMessage...");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;
        //Joan
        var receiver = data.receiver;
        var  status = data.status;
        console.log("username:........" + username);
        console.log("receiver:........" + receiver);

        client.broadcast.emit("messages", data);//无论公聊私聊都广播发

        if (receiver === "All") {
            msgModel.saveAllMsg("publicmsg", username, message, datetime, status,function (err, status) {
            });
        } else {
            msgModel.savePrivateMsg("privatemsg", username, receiver, message, datetime,status, function (err, status) {
            });

        }

    });


    client.on("announcements", function (data) {
        console.log("on incomingAnnouncement...");
        /*socket.emit("announcements",
        {username:username,datetime:getTimer(),annocement:annocement});*/
        var username = data.username;
        var annocement = data.annocement;
        var datetime = data.datetime;

        console.log(username + " ," + annocement + " ," + datetime);

        client.broadcast.emit("announcements", {username: username, annocement: annocement, datetime: datetime});

        msgModel.saveAnnoucement( username, annocement, datetime, function (err,status) {
        });
    });

    //status: selValue, updatedat: getTimer()
    client.on("status", function (data) {
        console.log(data.username + ".......change status");
        userModel.updateStatus(data.username, data.status, data.updatedat, function (err, status) {
            if(err){
                console.log("update status err...." + err + "......" + status);
            }
        });
        client.broadcast.emit("status", data);
        //client.broadcast.emit("messages", data);//无论公聊私聊都广播发
        console.log("client.broadcast.emit('status', data);");

    });


    client.on('disconnect', function() {

        var time = getTimer();
        userModel.updateLogout(client.name,time);
    });


    //socket.emit("searchUser",{username:username,keyword:keyword});
    client.on("searchUser",function(data){
        var users =[];
        userModel.searchUsers(data.keyword, function (err, userList) {
            if (err) {
                console.log("getPublic msg error");
            }
            else
            {
                users=userList;
            }
            console.log("users length is :"+users.length);
            client.emit("searchUser",{userList:users});
        });
    });

    client.on("searchByStatus",function(data){
        var users =[];
        userModel.searchUsersByStatus(data.keyword, function (err, userList) {
            if (err) {
                console.log("getPublic msg error");
            }
            else
            {
                users=userList;
            }
            console.log("users length is :"+users.length);
            client.emit("searchByStatus",{userList:users});
        });
    });


   // socket.emit("searchPubMsg",{username:username,keyword:keyword});
    client.on("searchPubMsg",function(data){
        var pubMsgList =[];
        msgModel.searchPubMsg(data.keyword, function (err, msgList) {
            if (err) {
                console.log("searchPubMsg msg error");
            }
            else
            {
                pubMsgList=msgList;
            }
            console.log("pubMsgList length is :"+pubMsgList.length);
            client.emit("searchPubMsg",{pubMsgList:pubMsgList});
        });
    });

    //socket.emit("searchPriMsg",{username:username,keyword:keyword});
    client.on("searchPriMsg",function(data){
        var msgs =[];
        msgModel.searchPrivateMsgs(data.keyword, function (err, msgList) {
            if (err) {
                console.log("searchPriMsg  error");
            }
            else
            {
                msgs=msgList;
            }
            console.log("msgs length is :"+msgs.length);
            client.emit("searchPriMsg",{msgList:msgs});
        });
    });

    //searchAnnouncements
    client.on("searchAnnouncements",function(data){
        var msgs =[];
        msgModel.searchAnnocement(data.keyword, function (err, msgList) {
            if (err) {
                console.log("searchPriMsg  error");
            }
            else
            {
                msgs=msgList;
            }
            console.log("msgs length is :"+msgs.length);
            client.emit("searchAnnouncements",{msgList:msgs});
        });
    });

    //接收用户发来的图片
    client.on('img', function(imgData) {
        //通过一个newImg事件分发到除自己外的每个用户
        console.log("server receive an img....");
        //user,datetime,status, imgData
        //{username: username,datetime: datetime,receiver: "All",image:e.target.result,status: status}
        client.broadcast.emit('newImg', imgData);
        if (imgData.receiver == "All") {
            msgModel.saveAllMsg("publicmsg", imgData.username, imgData.image, imgData.datetime, imgData.status,function (err, status) {
            });
        } else {
            msgModel.savePrivateMsg("privatemsg", imgData.username, imgData.receiver, imgData.image, imgData.datetime,imgData.status, function (err, status) {
            });

        }

    });



});
server.listen(app.get('port'));
console.log("App Server is up and running. Listening on port 8888:");