$(document).ready(function(){
  $('#directorypage').addClass('active');
  var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);
      socket.on("announcements", function(data)
    {
    
    
    $('#annalert').show();
    
    });
});