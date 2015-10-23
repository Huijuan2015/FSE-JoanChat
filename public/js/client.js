$('document').ready( function()
{

function isWeak(name, value) 
{

 	if(name.val().length < value)
 		return true;
 	else 
 		return false;
}

function isBanned(name) 
{

    var dict = {};

    $.ajax({
        url: "/reserved-username-list.txt",
        success: function(txt) {
            var words = txt.split(" ");            
            for ( var i = 0; i < words.length; i++ ) {
                dict[ words[i] ] = true;
            }
        },
        async: false
    });
    
    return dict[name.val()];
}

function isUnequal(password, repassword) 
{
    if(password.val() === repassword.val()) 
    {
        return false;
    }
    else
    { 
        return true;
    }
}

$('#signUpform').submit(function(e)
{
  e.preventDefault();
  console.log("here!");
  var validated = true;
  
  clearError($('#uerror'));
  clearError($('#perror'));
  clearError($('#rperror'));
  clearError($('#fnerror'));
  clearError($('#loerror'));

    // if(isNull($('#fullname'))) {
    //   setError($('#fnerror'), "please enter full name");
    //   validated=false;
    // }


    // if(isNull($('#location'))) {
    //   setError($('#loerror'), "please enter location");
    //   validated=false;
    // }

  if(isNull($('#username'))) {
      setError($('#uerror'), "please enter username");
      validated=false;
    }

    if(isNull($('#password'))) {
      setError($('#perror'), "please enter password");
      validated=false;
    }


  if(isWeak($('#username'), 3)) {
      setError($('#uerror'), "username must be at least 3 characters long");
      validated=false;
    }

    if(isWeak($('#password'), 4)) {
      setError($('#perror'), "password must be at least 4 characters long");
      validated=false;
    }

    if(isBanned($('#username'))) {
      setError($('#uerror'), "illegal username");
      validated=false;
    }

    if(isUnequal($('#password'), $('#repassword'))) {
      setError($('#rperror'), "two different passwords entered");
      validated=false;
    }

    if(validated)
    {
        $('#createdat').val(getTimer());
        $('#signUpform')[0].submit();
    }
});    
  

$('#loginForm').submit(function(e)
{
    e.preventDefault();
    
    var validated = true; 
    
    if(isNull($('#username'))) {
      setError($('#uerror'), "please enter username");
      validated=false;
    }

    if(isNull($('#password'))) {
      setError($('#perror'), "please enter password");
      validated=false;
    }
   
    if(validated)
    {
      $('#lastloginat').val(getTimer());
      $('#loginForm')[0].submit();
    }
});





function setError(error, text, flag)
{
  error.text(text);
  error.show();
  flag=false;
}

function isNull (value) 
{
  if (!value.val()) 
  {
    return true;
  }
  else 
  {
    return false;
  }
}

function clearError(error) 
{
  error.text('');
  error.hide();
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

});

