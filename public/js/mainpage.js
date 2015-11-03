$('document').ready(function () {

    var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);

    //拿到了上一次logout的时间,为的是判断历史信息是已读的还是未读的
    var lastlogout = $('#lastLogout').attr("value").replace("%20", ' ');
    console.log("lastlogout............."+lastlogout);

    // var lis = $("#myNavbar ul:first li");

    //当前用户,第二句是把它对应的alert永久隐藏不展示.
    var username = $('#user').text();
    document.getElementById(username + "alert").style.display = "none";

    //<body>标签
    var body = $('body');

    //当前窗口
    var curWin = "welcome";

    //arr放的是当前页面有的窗口的id们,然后后面私聊的窗口id也会放进arr里面
    var arr = new Array();
    arr.push("welcome");    //welcome窗口
    arr.push("direct");     //directory窗口
    arr.push("All");        //公聊窗口
    arr.push("annonce");    //公告窗口
    arr.push("searchResult")  //搜索结果窗口

    var allUsers = [];
    var publicMsg = [];
    var privateMsg = [];
    var statusOK = [];
    var statusHELP = [];
    var statusSOS = [];

    var splitter = '|';


    socket.on("allUsers", function (data) {
        var all = data.userList;
        for (var i = 0; i < all.length; i++) {
            allUsers.push(all[i].username);
        }
    });

    //自己上线,告诉服务器
    socket.emit('online', {user: username});

    //$('li')是黑色的那栏的东西,就是有消息提醒的时候,点一点它,消息提醒的new就hide
    $('li').click(function () {
        console.log("lis[i].click........" + $(this).children('a').text().substring(0, $(this).children('a').text().indexOf('New')));
        $(this).children('a').children('span').hide();    //消息提醒的new就hide
        showThisHideOther(arr[$(this).index()], arr);      //然后它对应的窗口就出来了
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

    //这是实现按enter键发消息的函数
    $(window).keydown(function (e) {
        if (e.keyCode == 13) {
            var datetime = getTimer(new Date());

            var statusDesc = $("#" + username + "Status").text();
            var status = statusMap(statusDesc);
            var statusStamp = getUserCurrentStatus(status);

            console.log("status........." + status);
            for (var i = 0; i < arr.length; i++) {
                if (document.getElementById(arr[i]).style.display === "inline") {    //当前窗口是显示的
                    if ($("#msgbox" + arr[i]).val() !== "") {
                        var message = $('#msgbox' + arr[i]).val();
                        $('#messages' + arr[i]).append('<div class="well"><p class = "pull-left"><b>' + username + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
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
            publicMsg.push(message + splitter + sender + splitter + receiver + splitter + datetime);//把消息放进数组里面
            if (datetime > lastlogout && curWin != "All") {    //解决旧消息也提醒的问题
                $('#chatroomalert').show();
            }
            $('#messagesAll').append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
            var scroller = $('.wrap');
            scroller.scrollTop(scroller.get(0).scrollHeight);
        }
        //私聊,并且是发给这个用户或者是这个用户发的(历史记录)
        else if (receiver === username || sender === username) {
            privateMsg.push(message + splitter + sender + splitter + receiver + splitter + datetime);//私聊消息放进数组

            if (datetime > lastlogout && sender != curWin) {    //解决旧消息也提醒的问题
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
                $('#messages' + sender).append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
                var scroller = $('.wrap');
                scroller.scrollTop(scroller.get(0).scrollHeight);
            }
            else if (arr.indexOf(sender) > 0 || arr.indexOf(receiver) > 0) {
                if (sender != receiver) {
                    $('#messages' + sender).append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
                }
                else {
                    $('#messages' + receiver).append('<div class="well"><p class = "pull-left"><b>' + sender + getUserCurrentStatus(status) + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
                }
            }
        }
    });

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

    //接收别人改status
    socket.on("status", function (data) {
        console.log('socket.on("status",function(data)');
        var status = data.status;
        var name = data.username;
        freshStatus(status, name);

    });

    //接收announcements
    socket.on("announcements", function (data) {
        console.log("Message received!");
        $('#annalert').show();

    });

    //搜索
    $('#searchBtn').click(function () {
        $('#userList').children().html('');
        var keyword = $('#searchBox').val();
        if (keyword != '') {
            searchUsers(keyword);     //搜索用户
            //searchPubMsg(keyword);
            //searchPriMsg(keyword);
        }
    });

    function searchUsers(keyword) {
        var result = [];
        for (var i = 0; i < allUsers.length; i++) {
            var singleUsr = allUsers[i];
            if (singleUsr.indexOf(keyword) >= 0) {
                result.push(singleUsr);
            }
        }
        if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                $('#userList').append('<span id="' + result[i] + 'span" class="badge badge-warning" style="display:inline">' + result[i] + '</span>');
            }
        }
    }

    function searchPubMsg(keyword){
        console.log("publicMsg length....."+publicMsg.length);
        for(var i=0;i<publicMsg.length-10;i++){
            var result = [];
            var singlrMsg = publicMsg[i];
                if (singlrMsg.indexOf(keyword) >= 0) {
                    result.push(singlrMsg);
                }

            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    $('#publicMsgList').append('<span id="' + result[i] + 'span" class="badge badge-warning" style="display:inline">' + result[i] + '</span>');
                    if(i>10){
                        break;
                    }
                }
            }
        }
    }

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
        console.log("statusymbol: " + statusSymbol);
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


    $("button[id^='postmsg']").on('click', function () {
        console.log("id....." + $(this).attr('id'));
    });
    $("#postmsgJane").on('click', function () {
        console.log("id....." + $(this).attr('id'));
    });
});