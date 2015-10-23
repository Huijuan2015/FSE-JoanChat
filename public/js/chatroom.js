$('document').ready(function () {

    $('#chatroompage').addClass('active');
    var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);
    var curLoginUser = $('#user').text();       //login user
    var curTalkingTo = $('#talkingTo').text();   //receiver of msg
//receive
    socket.on("messages", function (data) {
        console.log("socket on messages......");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;
        var receiver = data.receiver;

        if (receiver === "All") {
            if (curTalkingTo === "All") {
                renderHTML(data.username, data.message, data.datetime);
            } else {
                ;
            }
            //TODO  存到消息提醒
        } else if (receiver === curLoginUser) {
            if (username === curTalkingTo) {
                renderHTML(data.username, data.message, data.datetime, data.receiver);
            } else {
                //TODO  存到消息提醒
            }
        }
    });

    socket.on("announcements", function (data) {
        console.log("Message received!");
        $('#annalert').show();

    });

    function renderHTML(username, message, datetime) {
        $('#messages').append('<div class="well"><p class = "pull-left"><b>' + username + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
        var scroller = $('.wrap');
        scroller.scrollTop(scroller.get(0).scrollHeight);
    }

    //send msg
    function sendMessage() {
        console.log("entered send");
        var message = $('#msgbox').val();
        var currentDateTime = new Date();
        var datetime = getTimer(currentDateTime);
        var username = $('#user').text();
        var receiver = $('#talkingTo').text();
        console.log("datetime--: " + datetime);
        console.log("username1--: " + username);
        console.log("receiver --:" + receiver);

        renderHTML(username, message, datetime);
        socket.emit("messages", {username: username, message: message, datetime: datetime, receiver: receiver});
        $('#msgbox').val('');
        $('#postmsg').attr("disabled", "true");
    }

    function outgoingMessageKeyChange() {
        var outgoingMessageValue = $('#msgbox').val();
        $('#postmsg').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
    }

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


    $('#msgbox').on('keyup keydown', outgoingMessageKeyChange);
    $('#postmsg').on('click', sendMessage);
});
