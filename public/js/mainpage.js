$('document').ready(function () {
    document.getElementById("welcome").style.display = "inline";
    document.getElementById("All").style.display = "none";
    document.getElementById("direct").style.display = "none";
    document.getElementById("annonce").style.display = "none";
    document.getElementById("searchResult").style.display = "none";
    document.getElementById("Bean").style.display = "none";
    document.getElementById("Jane").style.display = "none";

    var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);

    //拿到了上一次logout的时间,为的是判断历史信息是已读的还是未读的
    var lastlogout = $('#lastLogout').attr("value").replace("%20", ' ');
    console.log("lastlogout............." + lastlogout);

    // var lis = $("#myNavbar ul:first li");

    //当前用户,第二句是把它对应的alert永久隐藏不展示.
    var username = $('#user').text();
    document.getElementById(username + "alert").style.display = "none";

    //<body>标签
    var body = $('body');

    //初始化emoji
    initialEmoji();
    initialEmoji1();
    initialEmoji2();
    //当前窗口
    var curWin = "welcome";

    //arr放的是当前页面有的窗口的id们,然后后面私聊的窗口id也会放进arr里面
    var arr = new Array();
    arr.push("welcome");    //welcome窗口
    arr.push("direct");     //directory窗口
    arr.push("All");        //公聊窗口
    arr.push("annonce");    //公告窗口
    arr.push("searchResult")  //搜索结果窗口
    arr.push("Jane");
    arr.push("Bean");

    var stopWords = ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your"];



    //自己上线,告诉服务器
    socket.emit('online', {user: username});

    //$('li')是黑色的那栏的东西,就是有消息提醒的时候,点一点它,消息提醒的new就hide
    $('li').click(function () {
        if ($(this).index() != 4) {

            console.log("lis[i].click........" + $(this).children('a').text().substring(0, $(this).children('a').text().indexOf('New')));
            $(this).children('a').children('span').hide();    //消息提醒的new就hide
            showThisHideOther(arr[$(this).index()], arr);      //然后它对应的窗口就出来了
        }
    });

    //这是点directory里面的用户名
    $('.panel-heading').click(function () {

        //这两行拿到的是点的那个用户名
        var str = $(this).children('a').first().text().replace(/(^\s*)|(\s*$)/g, "");
        var name = str.substring(0, str.indexOf("New")).replace(/(^\s*)|(\s*$)/g, "");

        //加个判断是不是自己,不是自己才进行括号里面的操作
        if (name !== username) {         ////@@@@@@@@@@@加这行

            //如果arr里面有了跟这个人的聊天窗口id
            if (arr.indexOf(name) >= 0) {
                console.log("name in arr....");
                $('#' + name + 'alert').hide();   //点了它,它旁边的alert就 hide起来
                showThisHideOther(name, arr);     //然后展示跟他聊天的窗口
            }

            //如果arr里面没有跟这个人聊天的窗口
            else {
                //在body下面新增跟这个人的聊天窗口,id是那个人的名字
                var prichat = '<div id="' + name + '" ><div class="container"><div class="wrap well" >'
                    + ' <ul class="nav nav-tabs nav-justified" id = "talkingTo' + name + '" style="color: #fff; text-align: center; font-size: 75%; font-weight: bold; background-color:#5bc0de ">' + name + '</ul>'
                    + '<div id="messages' + name + '"></div><div class="push"></div></div></div><div class="footer"><div class="container"><div class="row"><div class="form-group"><div class="col-xs-8 col-sm-9">'
                    + '<input type="text" class="form-control input-lg" rows="3" id="msgbox' + name + '" name="msgbox"></div><div class="col-xs-4 col-sm-2"><button type="submit" id="postmsg' + name + '" class="form-control btn btn-info" >Post</button></div></div></div></div></div></div>';
                body.append(prichat);

                arr.push(name);   //然后把这个新增的窗口id放进arr里面
                //TODO 把聊天记录放这里,每次打开新聊天窗口都emit prihistory 然后on prihistory

                showThisHideOther(name, arr);   //然后就是展现在这个新建的聊天窗口嘛
            }
        }
    });

    $('.searchUser').click(function () {
        var name = $(this).children('a').first().text().replace(/(^\s*)|(\s*$)/g, "");

        //加个判断是不是自己,不是自己才进行括号里面的操作
        if (name !== username) {         ////@@@@@@@@@@@加这行

            //如果arr里面有了跟这个人的聊天窗口id
            if (arr.indexOf(name) >= 0) {
                console.log("name in arr....");
                // $('#' + name + 'alert').hide();   //点了它,它旁边的alert就 hide起来
                showThisHideOther(name, arr);     //然后展示跟他聊天的窗口
            }

            //如果arr里面没有跟这个人聊天的窗口
            else {
                //在body下面新增跟这个人的聊天窗口,id是那个人的名字
                var prichat = '<div id="' + name + '" ><div class="container"><div class="wrap well" >'
                    + ' <ul class="nav nav-tabs nav-justified" id = "talkingTo' + name + '" style="color: #fff; text-align: center; font-size: 75%; font-weight: bold; background-color:#5bc0de ">' + name + '</ul>'
                    + '<div id="messages' + name + '"></div><div class="push"></div></div></div><div class="footer"><div class="container"><div class="row"><div class="form-group"><div class="col-xs-8 col-sm-9">'
                    + '<input type="text" class="form-control input-lg" rows="3" id="msgbox' + name + '" name="msgbox"></div><div class="col-xs-4 col-sm-2"><button type="submit" id="postmsg' + name + '" class="form-control btn btn-info" >Post</button></div></div></div></div></div></div>';
                body.append(prichat);

                arr.push(name);   //然后把这个新增的窗口id放进arr里面
                //TODO 把聊天记录放这里,每次打开新聊天窗口都emit prihistory 然后on prihistory

                showThisHideOther(name, arr);   //然后就是展现在这个新建的聊天窗口嘛
            }
        }
    });

    //这是实现按enter键发消息的函数
    $(window).keydown(function (e) {
        if (e.keyCode == 13 && curWin != "annonce") {
            var datetime = getTimer(new Date());

            var statusDesc = $("#" + username + "Status").text();
            var status = statusMap(statusDesc);
            var statusStamp = getUserCurrentStatus(status);

            console.log("status........." + status);
            for (var i = 0; i < arr.length; i++) {
                if (document.getElementById(arr[i]).style.display === "inline") {    //当前窗口是显示的
                    if ($("#msgbox" + arr[i]).val() !== "") {
                        var message = $('#msgbox' + arr[i]).val();
                        $('#messages' + arr[i]).append('<div class="well"><p class = "pull-left"><b>' + username + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
                        socket.emit("messages", {
                            username: username,
                            message: message,
                            datetime: datetime,
                            receiver: arr[i],
                            status: status
                        });

                        $("#msgbox" + arr[i]).val('');
                        var scroller = $('.wrap');
                        scroller.scrollTop(scroller.get(0).scrollHeight);
                    }
                    break;
                }

            }
        }
    });

    //收消息
    socket.on("messages", function (data) {

        console.log("socket on messages......");
        var sender = data.username;
        var message = data.message;
        var datetime = data.datetime;
        var receiver = data.receiver;
        var status = data.status;

        //如果是公聊消息
        if (receiver === "All") {
           // publicMsg.push(message + splitter + sender + splitter + receiver + splitter + datetime);//把消息放进数组里面
            if (toDate(datetime)  > toDate(lastlogout)  && curWin != "All") {    //解决旧消息也提醒的问题
                $('#chatroomalert').show();
            }
            //$('#messagesAll').append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
            showPublicMsg(sender,message,datetime,status);
            var scroller = $('.wrap');
            scroller.scrollTop(scroller.get(0).scrollHeight);
        }
        //私聊,并且是发给这个用户或者是这个用户发的(历史记录)
        else if (receiver === username || sender === username) {
            //privateMsg.push(message + splitter + sender + splitter + receiver + splitter + datetime);//私聊消息放进数组

            if (toDate(datetime)  > toDate(lastlogout)  && sender != curWin) {    //解决旧消息也提醒的问题
                $('#privatealert').show();    //新消息,directory那里就有new提示啦
                if (sender != username) {
                    $('#' + sender + 'alert').show();
                }
            }
            //如果还没有跟发消息人的聊天窗口,新增聊天窗口
            if (arr.indexOf(sender) < 0 && sender != username) {
                var prichat = '<div id="' + sender + '" ><div class="container"><div class="wrap well" >'
                    + ' <ul class="nav nav-tabs nav-justified" id = "talkingTo' + sender + '" style="color: #fff; text-align: center; font-size: 75%; font-weight: bold; background-color:#5bc0de ">' + sender + '</ul>'
                    + '<div id="messages' + sender + '"></div><div class="push"></div></div></div><div class="footer"><div class="container"><div class="row"><div class="form-group"><div class="col-xs-8 col-sm-9">'
                    + '<input type="text" class="form-control input-lg" rows="3" id="msgbox' + sender + '" name="msgbox"></div><div class="col-xs-4 col-sm-2"><button type="submit" id="postmsg' + sender + '" class="form-control btn btn-info" >Post</button></div></div></div></div></div></div>';
                body.append(prichat);
                arr.push(sender);
                document.getElementById(sender).style.display = "none";
               // $('#messages' + sender).append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
                 showPriMsg(sender,message,datetime,status);
                var scroller = $('.wrap');
                scroller.scrollTop(scroller.get(0).scrollHeight);
            }else if(sender==username && arr.indexOf(receiver)<0){
                var prichat = '<div id="' + receiver + '" ><div class="container"><div class="wrap well" >'
                    + ' <ul class="nav nav-tabs nav-justified" id = "talkingTo' + receiver + '" style="color: #fff; text-align: center; font-size: 75%; font-weight: bold; background-color:#5bc0de ">' + receiver + '</ul>'
                    + '<div id="messages' + receiver + '"></div><div class="push"></div></div></div><div class="footer"><div class="container"><div class="row"><div class="form-group"><div class="col-xs-8 col-sm-9">'
                    + '<input type="text" class="form-control input-lg" rows="3" id="msgbox' + receiver + '" name="msgbox"></div><div class="col-xs-4 col-sm-2"><button type="submit" id="postmsg' + receiver + '" class="form-control btn btn-info" >Post</button></div></div></div></div></div></div>';
                body.append(prichat);
                arr.push(receiver);
                document.getElementById(receiver).style.display = "none";
               // $('#messages' + receiver).append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
                showPriMsg(sender,message,datetime,status);
                var scroller = $('.wrap');
                scroller.scrollTop(scroller.get(0).scrollHeight);
            }
            else if (arr.indexOf(sender) > 0 || arr.indexOf(receiver) > 0) {
                if (sender != username) {
                  //  $('#messages' + sender).append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
                    showPriMsg(sender,message,datetime,status);
                }
                else {
                    showPriMsg(receiver,message,datetime,status);
                  //  $('#messages' + receiver).append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
                }
            }
        }
    });

    function showPublicMsg (sender,message,datetime,status){
        var index = message.indexOf("data:image/");
        if(index==0){
            displayImage(sender,datetime,status,message);
        }
        else{
            $('#messagesAll' ).append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
        }
    }

    function showPriMsg (sender,message,datetime,status){
        var index = message.indexOf("data:image/");
        if(index==0){
            if(sender=='Bean'){
                displayBeanImage(sender,datetime,status,message);
            }else if(sender=='Jane'){
                displayJaneImage(sender,datetime,status,message);
            }
        }
        else{
            $('#messages'+sender).append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
        }
    }

    //改status
    $('.status').click(function () {
        // e.preventDefault();
        var selText = $(this).children('a').text();
        var selValue = $(this).children('a').attr("id");
        console.log("value: " + selValue);
        console.log("text: " + selText);
        $('#statusmsg').text(selText);
        $('#statusmsg').show();
        //$.post("/status", {status: selValue, updatedat: getTimer()});
        socket.emit("status", {username: username, status: selValue, updatedat: getTimer()});

        freshStatus(selValue, username);
    });


/*
    '<div class="nav nav-tabs nav-justified" style="color: #fff; font-size: 75%; font-weight: bold; background-color:white"> <div class="btn-group" role="group"> '
    '<input type="file" id="'+name+'Image" value="Image" class="btn btn-default" style="height: 44px;width: 200px; background-color:#D8D8D8; border-radius: 5px;">Send image</input>'
    '<button type="button" id="'+name+'Sticker" class="btn btn-default" style="height: 44px;width: 200px; background-color:#D8D8D8; border-radius: 5px;">Send sticker</button>'
    '</div> <div id="emojiWrapper'+name+"></div>'

    </div>*/



    //接收别人改status
    socket.on("status", function (data) {
        console.log('socket.on("status",function(data)');
        var status = data.status;
        var name = data.username;
        freshStatus(status, name);

    });


    /**
     * 888888888888888888888888888888888888888888888888888888888888888888888888888*/
        //接收announcements
    socket.on("announcements", function (data) {
        console.log("Message received!");
        $('#messages').append('<div class="well"><p class = "pull-left"><b>' + data.username + '</b></p><p class="dateTimeFormat pull-right"><b>' + data.datetime + '</b></p><br><div class="clearfix"></div><p>' + data.annocement + '</p></div>');


    });

    $(window).keydown(function (e) {
        if (e.keyCode == 13 && curWin == "annonce") {
            var annocement = $('#msgbox').val();
            if (annocement != '') {

                $('#messages').append('<div class="well"><p class = "pull-left"><b>' + username + '</b></p><p class="dateTimeFormat pull-right"><b>' + getTimer() + '</b></p><br><div class="clearfix"></div><p>' + annocement + '</p></div>');
                $('#msgbox').val('');
                socket.emit("announcements", {username: username, datetime: getTimer(), annocement: annocement});
            }
        }
    });

    socket.on("searchAnnouncements", function (data) {

        var annocements = data.msgList;
        if (annocements.length == 0) {
            $('#announcementList').append('<div>Cannot find annocement like this!</div>');
        } else {
            for (var i = 0; i < annocements.length; i++) {
                var msg = annocements[i];
                var sender = msg.username;
                var message = msg.message;
                var datetime = msg.datetime;
                $('#announcementList').append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
            }
        }
    });


    /**
     * 8888888888888888888888888888888888888888888888888888888888888888888888*/


        //搜索
    $('#searchBtn').click(function () {
        showThisHideOther("searchResult", arr);
        removeAllChild("userList");
        removeAllChild("statusList");
        removeAllChild("publicMsgList");
        removeAllChild("privateMsgList");
        removeAllChild("announcementList");

        var keyword = $('#searchBox').val();
        if (keyword != '') {
            if(stopWords.indexOf(keyword)>=0){
                alert("Ooops,you cannot search stop words.Please try again.");
            }else {

                socket.emit("searchUser", {username: username, keyword: keyword});

                socket.emit("searchPubMsg", {username: username, keyword: keyword});

                socket.emit("searchPriMsg", {username: username, keyword: keyword});

                socket.emit("searchByStatus", {username: username, keyword: keyword});

                socket.emit("searchAnnouncements", {username: username, keyword: keyword});

            }}
    });

    $('#searchBox').focus(function () {
        showThisHideOther("searchResult", arr);
    });


    socket.on("searchUser", function (data) {
        var users = data.userList;
        if (users.length == 0) {
            $('#userList').append('<div>No such username like this</div>');
        } else {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.isonline === 1) {
                    $('#userList').append('<div class="searchUser"><a href="#" > <span class="glyphicon glyphicon-plus-sign" style="color:green;"></span>' + user.username + '<span id="' + user.username + 'Span" class="badge badge-warning" style="display:none">New</span> </a></div>');
                } else {
                    $('#userList').append('<div  class="searchUser"></div><a href="#"> <span class="glyphicon glyphicon-minus-sign" style="color:red;"></span>' + user.username + '<span id="' + user.username + 'Span" class="badge badge-warning" style="display:none">New</span> </a></div>');
                }
            }
        }
    });

    socket.on("searchByStatus", function (data) {

        var userList = data.userList;
        if (userList.length == 0) {
            $('#statusList').append('<div>No user in such status</div>');
        } else {
            var status = userList[0].status;
            for (var i = 0; i < userList.length; i++) {
                var name = userList[i].username;
                $('#statusList').append('<div>' + name + getUserCurrentStatus(status) + '</div>');
            }
        }
    });
    socket.on("searchPubMsg", function (data) {
        var msgs = data.pubMsgList.reverse();
        if (msgs.length == 0) {
            $('#publicMsgList').append('<div>Cannot find public message like this!</div>');
        } else {
            for (var i = 0; i < msgs.length; i++) {
                var msg = msgs[i];
                var sender = msg.username;
                var datetime = msg.datetime;
                var message = msg.message;
                var status = msg.status;
                $('#publicMsgList').append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>')
            }
        }
    });

    socket.on("searchPriMsg", function (data) {
        var primsgs = data.msgList.reverse();
        if (primsgs.length == 0) {
            $('#privateMsgList').append('<div>Cannot find private message like this!</div>');
        } else {
            for (var i = 0; i < primsgs.length; i++) {
                var msg = primsgs[i];
                var sender = msg.username;
                var message = msg.message;
                var datetime = msg.datetime;
                var status = msg.status;
                $('#privateMsgList').append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + showEmoji(message) + '</p></div>');
            }
        }
    });


    //通用函数
    function showThisHideOther(id, arr) {
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] === id) {
                document.getElementById(arr[i]).style.display = "inline";
                curWin = id;
            }
            else {

                document.getElementById(arr[i]).style.display = "none";
            }
        }
    }

    //通用函数
    function getTimer() {
        var date = new Date();
        var hr = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var day = (date.getDate()).toString();
        var month = (date.getMonth() + 1).toString();
        var year = (date.getFullYear()).toString();
        var fullDate = year + '-' + month + '-' + day + ' ' + hr + ':' + min;
        console.log("fullDate: " + fullDate);
        return fullDate;
    }

    //通用函数
    function getUserCurrentStatus(status) {
        var statusSymbol;

        console.log("Function status" + status);
        if (status == "OK") {
            statusSymbol = '<span class ="xicon glyphicon glyphicon-ok-sign" style="color:green;"></span>';
        }
        else if (status == "HELP") {
            statusSymbol = '<span class ="xicon glyphicon glyphicon-exclamation-sign" style="color:#FFD700;"></span>';
        }
        else if (status == "SOS") {
            statusSymbol = '<span class ="xicon glyphicon glyphicon-plus-sign" style="color:red;"></span>';
        }
        else if (status == "NONE") {
            statusSymbol = '';
        }
       // console.log("statusymbol: " + statusSymbol);
        return statusSymbol;
    }

    //通用函数
    function freshStatus(status, name) {

        console.log("Function status" + status);
        if (status == "OK") {
            $("#" + name + "Sta").children('div').children().html('<span><small>Status:<div class ="xicon glyphicon glyphicon-ok-sign" style="color:green;"></div> <span id="' + name + 'Status">I am OK, I do not need help.</small></span>');
        }
        if (status == "HELP") {
            $("#" + name + "Sta").children('div').children().html('<span><small>Status: <div class ="xicon glyphicon glyphicon-exclamation-sign" style="color:#FFD700;"></div><span id= "' + name + 'Status">I need help but it is not life threatening.</small></span>');
        }
        if (status == "SOS") {
            $("#" + name + "Sta").children('div').children().html('<span><small>Status: <div class ="xicon glyphicon glyphicon-plus-sign" style="color:red;"></div><span id="' + name + 'Status">Help me this is an emergency!</small></span>');
        }
        if (status == "NONE") {
            // <span><small>Status: <div style="color:gray;"></div><span>The user has not provided their status yet.</small></span>

        }
    }

    //通用函数
    function statusMap(status) {
        if (status == "I am OK, I do not need help.") {
            return "OK";
        }
        else if (status == "I need help but it is not life threatening.") {
            return "HELP";
        }
        else if (status == "Help me this is an emergency!") {
            return "SOS";
        }
        else
            return "NONE";
    }

    function removeAllChild(id) {
        var div = document.getElementById(id);
        while (div.hasChildNodes()) //当div下还存在子节点时 循环继续
        {
            div.removeChild(div.firstChild);
        }
    }

    function toDate(timeStr){
        var str = timeStr;
        str = str.replace(/-/g,"/");
        return  new Date(str);
    }

    document.getElementById('AllImage').addEventListener('change', function() {
        //检查是否有文件被选中
        if (this.files.length != 0) {
            //获取文件并用FileReader进行读取
            var file = this.files[0],
                reader = new FileReader();
            if (!reader) {

                //displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                $('#messagesAll').append('<div class="well">!your browser doesn\'t support fileReader</div>');
                this.value = '';
                return;
            };
            reader.onload = function(e) {
                //读取成功，显示到页面并发送到服务器
                var datetime = getTimer(new Date())
                this.value = '';
                var statusDesc = $("#" + username + "Status").text();
                var status = statusMap(statusDesc);
                socket.emit('img', {username: username,datetime: datetime,receiver: "All",image:e.target.result,status: status});
                displayImage(username,datetime,status, e.target.result);
            };
            reader.readAsDataURL(file);
        };
    }, false);

    document.getElementById('BeanImage').addEventListener('change', function() {
        //检查是否有文件被选中
        if (this.files.length != 0) {
            //获取文件并用FileReader进行读取
            var file = this.files[0],
                reader = new FileReader();
            if (!reader) {

                //displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                $('#messagesBean').append('<div class="well">!your browser doesn\'t support fileReader</div>');
                this.value = '';
                return;
            };
            reader.onload = function(e) {
                //读取成功，显示到页面并发送到服务器
                var datetime = getTimer(new Date())
                this.value = '';
                var statusDesc = $("#" + username + "Status").text();
                var status = statusMap(statusDesc);
                socket.emit('img', {username: username,datetime: datetime,receiver: "Bean",image:e.target.result,status: status});
                displayBeanImage('Bean',datetime,status, e.target.result);
            };
            reader.readAsDataURL(file);
        };
    }, false);

    document.getElementById('JaneImage').addEventListener('change', function() {
        //检查是否有文件被选中
        if (this.files.length != 0) {
            //获取文件并用FileReader进行读取
            var file = this.files[0],
                reader = new FileReader();
            if (!reader) {

                //displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                $('#messagesJane').append('<div class="well">!your browser doesn\'t support fileReader</div>');
                this.value = '';
                return;
            };
            reader.onload = function(e) {
                //读取成功，显示到页面并发送到服务器
                var datetime = getTimer(new Date())
                this.value = '';
                var statusDesc = $("#" + username + "Status").text();
                var status = statusMap(statusDesc);
                socket.emit('img', {username: username,datetime: datetime,receiver: "Bean",image:e.target.result,status: status});
                displayJaneImage('Jane',datetime,status, e.target.result);
            };
            reader.readAsDataURL(file);
        };
    }, false);



    socket.on('newImg', function(data) {
        if(data.receiver=='All'){
            displayImage(data.username,data.datetime,data.status,data.image);
        }
        else if(data.receiver=='Bean'){
            displayBeanImage(data.username,data.datetime,data.status,data.image);
        }
        else if(data.receiver=='Jane'){
            displayJaneImage(data.username,data.datetime,data.status,data.image);
        }

    });

    function displayImage(user,datetime,status, imgData) {
        //var container = document.getElementById('messagesAll');
        var statusStamp = getUserCurrentStatus(status);
        //var id = 'messagesAll';
         $('#messagesAll').append('<div class="well"><p class = "pull-left"><b>' + user + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>' + '</div>');
       // container.scrollTop = container.scrollHeight;
    }

    function displayBeanImage(user,datetime,status, imgData) {
        //var container = document.getElementById('messagesAll');
        var statusStamp = getUserCurrentStatus(status);
        //var id = 'messagesAll';
        $('#messagesBean').append('<div class="well"><p class = "pull-left"><b>' + user + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>' + '</div>');
        // container.scrollTop = container.scrollHeight;
    }

   /* function displayPriImage(user,datetime,status, imgData) {
        var statusStamp = getUserCurrentStatus(status);
        var msgId = 'messages'+user;
        var container = document.getElementById(msgId);
        document.getElementById(msgId).append('<div class="well"><p class = "pull-left"><b>' + user + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>' + '</div>');
        container.scrollTop = container.scrollHeight;
    }*/

    function displayJaneImage(user,datetime,status, imgData) {
        //var container = document.getElementById('messagesAll');
        var statusStamp = getUserCurrentStatus(status);
        //var id = 'messagesAll';
        $('#messagesJane').append('<div class="well"><p class = "pull-left"><b>' + user + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>' + '</div>');
        // container.scrollTop = container.scrollHeight;
    }

    function initialEmoji() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 20; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    }
    function initialEmoji1() {
        var emojiContainer = document.getElementById('emojiWrapperBean'),
            docFragment = document.createDocumentFragment();
        for (var i = 20; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    }
    function initialEmoji2() {
        var emojiContainer = document.getElementById('emojiWrapperJane'),
            docFragment = document.createDocumentFragment();
        for (var i = 20; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    }





    document.getElementById('AllSticker').addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        emojiwrapper.style.display = 'block';
        e.stopPropagation();
    }, false);

    document.getElementById('BeanSticker').addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapperBean');
        emojiwrapper.style.display = 'block';
        e.stopPropagation();
    }, false);

    document.getElementById('JaneSticker').addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapperJane');
        emojiwrapper.style.display = 'block';
        e.stopPropagation();
    }, false);


    document.body.addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });

    document.body.addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapperJane');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });

    document.body.addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapperBean');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });




    document.getElementById('emojiWrapper').addEventListener('click', function(e) {
        //获取被点击的表情
        var target = e.target;
        if (target.nodeName.toLowerCase() == 'img') {
            var messageInput = document.getElementById('msgboxAll');
            messageInput.focus();
            messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
        };
    }, false);

    document.getElementById('emojiWrapperBean').addEventListener('click', function(e) {
        //获取被点击的表情
        var target = e.target;
        if (target.nodeName.toLowerCase() == 'img') {
            var messageInput = document.getElementById('msgboxBean');
            messageInput.focus();
            messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
        };
    }, false);

    document.getElementById('emojiWrapperJane').addEventListener('click', function(e) {
        //获取被点击的表情
        var target = e.target;
        if (target.nodeName.toLowerCase() == 'img') {
            var messageInput = document.getElementById('msgboxJane');
            messageInput.focus();
            messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
        };
    }, false);

    function showEmoji(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../emoji/' + emojiIndex + '.gif" />');
            };
        };
        return result;
    }


});