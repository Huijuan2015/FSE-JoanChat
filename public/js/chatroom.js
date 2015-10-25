$('document').ready(function () {

    $('#chatroompage').addClass('active');
    var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);
    var curLoginUser = $('#user').text();       //login user
    console.log("curLoginUser........."+curLoginUser);

    var curTalkingTo = $('#talkingTo').text();   //receiver of msg
//receive

    console.log("curTalkingTo......."+curTalkingTo);
    socket.on("messages", function (data) {

        console.log("socket on messages......");
        var username = data.username;
        var message = data.message;
        var datetime = data.datetime;
        var receiver = data.receiver;
        if(receiver==="All"){
            $('#chatroomalert').show();
        }else{
            $('#privatealert').show();
            $('#'+receiver+'alert').show();

        }
        console.log(username+message+receiver);
        if (receiver === "All") {
            console.log("receiver====All.....")
            renderHTML(username, data.message, data.datetime,receiver);
            }
            //TODO  存到消息提醒
        else  {
                console.log("receiver....."+receiver);
                renderHTML(username, data.message, data.datetime, receiver);

                //TODO  存到消息提醒
            }

    });

    socket.on("announcements", function (data) {
        console.log("Message received!");
        $('#annalert').show();

    });

    function renderHTML(username, message, datetime,receiver) {
        $('#messages'+receiver).append('<div class="well"><p class = "pull-left"><b>' + username + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
        var scroller = $('.wrap');
        scroller.scrollTop(scroller.get(0).scrollHeight);
    }

    //send msg
    function sendMessage(receiver) {

        console.log("entered send...."+receiver );
        var message = $('#msgbox'+receiver).val();
        var currentDateTime = new Date();
        var datetime = getTimer(currentDateTime);
        var username = $('#user').text();
        //var receiver = $('#talkingTo'+receiver).text();
        console.log("datetime--: " + datetime);
        console.log("username--: " + username);
        console.log("receiver --:" + receiver);
        //$('#'+id).parent();
        //console.log("$('#<%=id%>').parent();....."+$('#'+id).parent());
        renderHTML(username, message, datetime,receiver);
        socket.emit("messages", {username: username, message: message, datetime: datetime, receiver: receiver});
        $('#msgbox'+receiver).val('');
       // $('#postmsg').attr("disabled", "true");
    }

   /* function outgoingMessageKeyChange() {
        var outgoingMessageValue = $('#msgbox').val();
        $('#postmsg').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
    }*/

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
    //$('#msgbox').on('keyup keydown', outgoingMessageKeyChange);
    $("button[id^='postmsg']").on('click', function(){
        console.log("click......");
        var id =$(this).attr('id');
        console.log("post button id ...."+id);
        var username = $('#user').text();
        var message =$('#'+id).parent().parent().children('div').children('input').val();

        var divid = $('#'+id).parent().parent().closest("div[class='footer']").parent().attr('id');
        var receiver = $('#'+divid+' div:first div:first ul:first').text();
        //var datetime = getTimer(new Date());
        //$('#'+divid+' div:first div:first div:first').append('<div class="well"><p class = "pull-left"><b>' + username + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' + message + '</p></div>');
        sendMessage(receiver);
       // var scroller = $('.wrap');
       // scroller.scrollTop(scroller.get(0).scrollHeight);
       // socket.emit("messages", {username: username, message: message, datetime: datetime, receiver: receiver});
       // $('#'+id).parent().parent().children('div').children('input').val('');
    });


});
