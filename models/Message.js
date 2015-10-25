var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../controllers/SSNOC.DB');
//Joan
function Message(username, message, datetime, receiver)
{
  this.local =
  {
    username : username,
    message : message,
    datetime  : datetime,
    receiver : receiver
  
     };
  }

// Message.storeMessage = function (username, message, datetime, callback)
// {
// 	  db.serialize(function() 
//     {
//       stmt = db.prepare("INSERT INTO USERMESSAGEHISTORY VALUES (?,?,?,?)");

//       stmt.run(null, username, message, datetime);
//        stmt.finalize();
//     });
// 	callback(err, true);
// }

//Joan
/*
Message.getMsgType = function(receiver, callback)
{
  //var messageType = '';
  if(receiver === "All"){
    messageType = 'publicmsg';
  }else{
    messageType = 'privatemsg';
  }
  console.log("message type is " + messageType);
  return messageType;


};*/
   


Message.getMsgs = function(messageType, callback)
{
  var msgList = [];
  console.log("Getting " + messageType + "s list...");

  var query;

  if(messageType === 'publicmsg')
  	query = "SELECT USERNAME, MESSAGE, DATETIME FROM USERPUBLICMESSAGEHISTORY limit 50";
  else if(messageType === 'announcement')
  	query = "SELECT USERNAME, MESSAGE, DATETIME FROM USERANNOUNCEMENTHISTORY";
  
  db.all(query, function(err, rows)
  {
    if(rows!== undefined)
    {
      rows.forEach(function (row)
      {
        var msgInfo = {};
        msgInfo.username = row.USERNAME;
        msgInfo.message = row.MESSAGE;
        msgInfo.datetime = row.DATETIME;
      
        console.log("row name: "+ row.USERNAME+"message: "+ row.MESSAGE);
        //msgList.push(msgInfo);

      });

      callback(null, msgList);
    }
    if (err)
      callback(err, null);
  });
  msgList = [];
};


Message.getPrivateMsgs = function(messageType, callback)
{
  var msgList = [];
  console.log("Getting " + messageType + "s list...");

  var query;
  if(messageType === 'privatemsg')
    query = 'SELECT SENDERUSERNAME, RECEIVERUSERNAME, MESSAGE, DATETIME FROM USERPRIVATEMESSAGEHISTORY';

  db.all(query, function(err, rows)
  {
    if(rows!== undefined)
    {
      rows.forEach(function (row)
      {
        var msgInfo = {};
        msgInfo.username = row.SENDERUSERNAME;
        //JOAN
        msgInfo.receiver = row.RECEIVERUSERNAME;
        msgInfo.message = row.MESSAGE;
        msgInfo.datetime = row.DATETIME;
        //SENDERUSERNAME, RECEIVERUSERNAME, MESSAGE, DATETIME
        console.log("row name: "+ row.SENDERUSERNAME+"message: "+ row.MESSAGE+"receiver: "+row.RECEIVERUSERNAME+"datetime:"+row.DATETIME);
        msgList.push(msgInfo);
      });

      callback(null, msgList);
    }
    if (err)
      callback(err, null);
  });
  msgList = [];
};


Message.saveAllMsg = function(messageType, username, message, datetime, callback)
{
	console.log("save " + message);

	var statement;

	if(messageType === 'publicmsg')
  		statement = "INSERT INTO USERPUBLICMESSAGEHISTORY(ID, USERNAME, MESSAGE, DATETIME) VALUES (?,?,?,?)";
  	else if(messageType === 'announcement')
  		statement = "INSERT INTO USERANNOUNCEMENTHISTORY(ID, USERNAME, MESSAGE, DATETIME) VALUES (?,?,?,?)";

	db.serialize(function(err)
    {
    		console.log("serializing start " + message);

      stmt = db.prepare(statement);

      stmt.run(null, username, message, datetime);
      stmt.finalize();
          		console.log("serializing end " + message);

    callback(null, 201);

    if (err)
      callback(err, null);

    });
}

Message.savePrivateMsg = function(messageType, username, receiver, message, datetime, callback)
{
  console.log("save " + message);

  var statement;
  if(messageType === 'privatemsg')
    statement = "INSERT INTO USERPRIVATEMESSAGEHISTORY(ID, SENDERUSERNAME, RECEIVERUSERNAME, MESSAGE, DATETIME) VALUES (?,?,?,?,?)";

  db.serialize(function(err)
    {
        console.log("serializing start " + message);

      stmt = db.prepare(statement);

      stmt.run(null, username,receiver, message, datetime);
      stmt.finalize();
              console.log("serializing end " + message);

    callback(null, 201);

    if (err)
      callback(err, null);

    });
}
module.exports = Message;
