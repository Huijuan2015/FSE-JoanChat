$('document').ready(function () {


    var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);

    var lis = $("#myNavbar ul:first li");
    console.log("divs.length:....." + lis.length);
    var username = $('#user').text();
    var small = $('body').children('small').children('small');
    var arr = new Array();
    arr.push("welcome");
    arr.push("direct");
    arr.push("All");
    arr.push("annonce");


    $('li').click(function () {
        console.log("lis[i].click........" + $(this).children('a').text().substring(0, $(this).children('a').text().indexOf('New')));
        $(this).children('a').children('span').hide();
        showThisHideOther(arr[$(this).index()], arr);

    });

    $('.panel-heading').click(function () {
        var str = $(this).children('a').first().text().replace(/(^\s*)|(\s*$)/g, "");
        var name = str.substring(0, str.indexOf("New"));
        console.log("name..........." + name);
        // document.getElementById('direct').style.display="none";
        if (arr.indexOf(name) >= 0) {
            console.log("name in arr....");
            //document.getElementById(name).style.display="inline";
            $('#' + name + 'alert').hide();
            showThisHideOther(name, arr);
        }
        else {
            var prichat = '<div id="' + name + '" ><div class="container"><div class="wrap well" >'
                + ' <ul class="nav nav-tabs nav-justified" id = "talkingTo' + name + '" style="color: #fff; text-align: center; font-size: 75%; font-weight: bold; background-color:#5bc0de ">' + name + '</ul>'
                + '<div id="messages' + name + '"></div><div class="push"></div></div></div><div class="footer"><div class="container"><div class="row"><div class="form-group"><div class="col-xs-8 col-sm-9">'
                + '<input type="text" class="form-control input-lg" rows="3" id="msgbox' + name + '" name="msgbox"></div><div class="col-xs-4 col-sm-2"><button type="submit" id="postmsg' + name + '" class="form-control btn btn-info" >Post</button></div></div></div></div></div></div>';
            small.append(prichat);
            //console.log(document.getElementById("postmsg"+name));
            arr.push(name);
            //TODO 把聊天记录放这里,每次打开新聊天窗口都emit prihistory 然后on prihistory

            //socket.emit("prihistory",{sender:name,receiver:username});
            showThisHideOther(name, arr);
        }
    });

    function showThisHideOther(id, arr) {
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] === id) {
                document.getElementById(arr[i]).style.display = "inline";
            }
            else {

                document.getElementById(arr[i]).style.display = "none";
            }
        }
    }

    $(window).keydown(function (e) {
        if (e.keyCode == 13) {

            var datetime = getTimer(new Date());
            for (var i = 0; i < arr.length; i++) {
                if (document.getElementById(arr[i]).style.display === "inline") {
                    if ($("#msgbox" + arr[i]).val() !== "") {
                        var message = $('#msgbox' + arr[i]).val();

                        $('#messages' + arr[i]).append('<div class="well"><p class = "pull-left"><b>' + username + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
                        socket.emit("messages", {
                            username: username,
                            message: message,
                            datetime: datetime,
                            receiver: arr[i]
                        });

                        $("#msgbox" + arr[i]).val('');
                        var scroller = $('.wrap');
                        scroller.scrollTop(scroller.get(0).scrollHeight);
                    }
                }
            }

        }

    });


    $("button[id^='postmsg']").on('click', function () {
        console.log("id....."+$(this).attr('id'));
    });
    $("#postmsgJane").on('click', function () {
        console.log("id....."+$(this).attr('id'));
    });
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


    socket.on("messages", function (data) {

        console.log("socket on messages......");
        var sender = data.username;
        var message = data.message;
        var datetime = data.datetime;
        var receiver = data.receiver;
        if (receiver === "All") {
            $('#chatroomalert').show();
            $('#messages' + receiver).append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
            var scroller = $('.wrap');
            scroller.scrollTop(scroller.get(0).scrollHeight);
        } else {
            $('#privatealert').show();
            $('#' + sender + 'alert').show();
            if(arr.indexOf(sender)<0){
                var prichat = '<div id="' + sender + '" ><div class="container"><div class="wrap well" >'
                    + ' <ul class="nav nav-tabs nav-justified" id = "talkingTo' + sender + '" style="color: #fff; text-align: center; font-size: 75%; font-weight: bold; background-color:#5bc0de ">' + sender + '</ul>'
                    + '<div id="messages' + sender + '"></div><div class="push"></div></div></div><div class="footer"><div class="container"><div class="row"><div class="form-group"><div class="col-xs-8 col-sm-9">'
                    + '<input type="text" class="form-control input-lg" rows="3" id="msgbox' + sender + '" name="msgbox"></div><div class="col-xs-4 col-sm-2"><button type="submit" id="postmsg' + sender + '" class="form-control btn btn-info" >Post</button></div></div></div></div></div></div>';
                small.append(prichat);
                //console.log(document.getElementById("postmsg"+name));
                arr.push(sender);
            }
            document.getElementById(sender).style.display="none";
            $('#messages' + sender).append('<div class="well"><p class = "pull-left"><b>' + sender + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');

            // $('#messages' + sender).append('<div class="well"><p class = "pull-left"><b>' + receiver + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
           // $('#messages' + receiver).append('<div class="well"><p class = "pull-left"><b>' + username + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');

            var scroller = $('.wrap');
            scroller.scrollTop(scroller.get(0).scrollHeight);
        }



    });

    socket.on("announcements", function (data) {
        console.log("Message received!");
        $('#annalert').show();

    });

    $('.status').click(function () {
        // e.preventDefault();
        var selText = $(this).children('a').text();
        var selValue = $(this).children('a').attr("id");
        console.log("value: "+ selValue);
        console.log("text: "+ selText);
        $('#statusmsg').text(selText);
        $('#statusmsg').show();
        //$.post("/status", {status: selValue, updatedat: getTimer()});
        socket.emit("status",{username:username,status: selValue, updatedat: getTimer()});
    });

    socket.on("status",function(data){
        console.log('socket.on("status",function(data)');
        var panel = $('.panel-heading');

        if(panel!==undefined  && panel.length>0){
            for(var i =0;i<panel.length;i++){
                var str = panel[i].children('a').first().text().replace(/(^\s*)|(\s*$)/g, "");
                var name = str.substring(0, str.indexOf("New"));
                var here = panel[i].parent().lastChild("div[class='panel-body']");
                console.log("........."+here);
                if(name!==data.username){
                    continue;
                }else{
                   if(data.status==="OK"){

                   }
                }

            }
        }
        /*<%if(userList[i].status =="OK") { %>
         <span><small>Status:<div class ="xicon glyphicon glyphicon-ok-sign" style="color:green;"></div> <span>I am OK, I do not need help.</small></span>
         <% } %>
         <%if(userList[i].status =="HELP") { %>
         <span><small>Status: <div class ="xicon glyphicon glyphicon-exclamation-sign" style="color:#FFD700;"></div><span>I need help but it is not life threatening.</small></span>
         <% } %>
         <%if(userList[i].status =="SOS") { %>
         <span><small>Status: <div class ="xicon glyphicon glyphicon-plus-sign" style="color:red;"></div><span>Help me this is an emergency!</small></span>
         <% } %>
         <%if(userList[i].status =="ND") { %>
         <span><small>Status: <div style="color:gray;"></div><span>The user has not provided their status yet.</small></span>
         */

    });

});