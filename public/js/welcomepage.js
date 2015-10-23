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

$('document').ready(function(){
	
  $('#welcomepage').addClass('active');
    var url = document.domain + ":8888";
    console.log(url);
    var socket = io.connect(url);
      socket.on("announcements", function(data)
    {
    
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
    	$.post("/status", {status: selValue, updatedat: getTimer()});
	});
});