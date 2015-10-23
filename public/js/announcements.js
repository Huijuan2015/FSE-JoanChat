

$('document').ready(function()
{

  $('#announcementspage').addClass('active');
  var url = document.domain + ":8888";
  console.log(url);
  var socket = io.connect(url);

  socket.on("announcements", function(data)
  {
    var username = data.username;
    var message = data.message;
    var datetime = data.datetime;

    renderHTML(data.username, data.message, data.datetime);
    
  });

  function renderHTML(username, message, datetime)
  {
    $('#messages').append('<div class="well"><p class = "pull-left"><b>'+ username +'</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><p>' +message + '</p></div>');
    var scroller = $('.wrap');
    scroller.scrollTop( scroller.get(0).scrollHeight );
  }
  
  function sendMessage()
  {
    console.log("entered send");
    var message = $('#msgbox').val();
    var currentDateTime = new Date();
    var datetime = getTimer(currentDateTime);
    var username =  $('#user').text ();
    console.log("datetime--: " + datetime);
    console.log("username1--: " + username);
 
    renderHTML(username, message, datetime);
    socket.emit("announcements", {username: username, message: message, datetime: datetime});
    $('#msgbox').val('');
    $('#postmsg').attr("disabled", "true");
  }

  function outgoingMessageKeyChange()
  {
    var outgoingMessageValue = $('#msgbox').val();
    $('#postmsg').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
  }
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


  $('#msgbox').on('keyup keydown', outgoingMessageKeyChange);
  $('#postmsg').on('click', sendMessage);
});


