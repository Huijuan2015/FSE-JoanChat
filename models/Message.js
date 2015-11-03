var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../controllers/SSNOC.DB');

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

//history msg?
Message.getMsgs = function(messageType, callback)
{
  var msgList = [];
  console.log("Getting " + messageType + "s list...");

  var query;

  if(messageType === 'publicmsg')
  	query = "SELECT USERNAME, MESSAGE, DATETIME, STATUS  FROM USERPUBLICMESSAGEHISTORY limit 50";
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
        msgInfo.status=row.STATUS
      
        msgList.push(msgInfo);

      });

      callback(null, msgList);
    }
    if (err)
      callback(err, null);
  });
  msgList = [];
};

//private msg history
Message.getPrivateMsgs = function(messageType, callback)
{
  var msgList = [];
  console.log("Getting " + messageType + "s list...");

  var query;
  if(messageType === 'privatemsg')
    query = 'SELECT SENDERUSERNAME, RECEIVERUSERNAME, MESSAGE, DATETIME , STATUS FROM USERPRIVATEMESSAGEHISTORY';

  db.all(query, function(err, rows)
  {
    if(rows!== undefined)
    {
      rows.forEach(function (row)
      {
        var msgInfo = {};
        msgInfo.username = row.SENDERUSERNAME;
        msgInfo.receiver = row.RECEIVERUSERNAME;
        msgInfo.message = row.MESSAGE;
        msgInfo.datetime = row.DATETIME;
        msgInfo.status = row.STATUS;
        msgList.push(msgInfo);
      });

      callback(null, msgList);
    }
    if (err)
      callback(err, null);
  });
  msgList = [];
};


//save msg
Message.saveAllMsg = function(messageType, username, message, datetime,status, callback)
{
	console.log("save " + message);

	var statement;

	if(messageType === 'publicmsg')
  		statement = "INSERT INTO USERPUBLICMESSAGEHISTORY(ID, USERNAME, MESSAGE, DATETIME,STATUS) VALUES (?,?,?,?,?)";
  	else if(messageType === 'announcement')
  		statement = "INSERT INTO USERANNOUNCEMENTHISTORY(ID, USERNAME, MESSAGE, DATETIME) VALUES (?,?,?,?)";

	db.serialize(function(err)
    {
    		console.log("serializing start " + message);

      stmt = db.prepare(statement);

      stmt.run(null, username, message, datetime,status);
      stmt.finalize();
          		console.log("serializing end " + message);

    callback(null, 201);

    if (err)
      callback(err, null);

    });
}

//save private msg
Message.savePrivateMsg = function(messageType, username, receiver, message, datetime,status, callback)
{
  console.log("save " + message);

  var statement;
  if(messageType === 'privatemsg')
    statement = "INSERT INTO USERPRIVATEMESSAGEHISTORY(ID, SENDERUSERNAME, RECEIVERUSERNAME, MESSAGE, DATETIME,STATUS) VALUES (?,?,?,?,?,?)";

  db.serialize(function(err)
    {
        console.log("serializing start " + message);

      stmt = db.prepare(statement);

      stmt.run(null, username,receiver, message, datetime,status);
      stmt.finalize();
              console.log("serializing end " + message);

    callback(null, 201);

    if (err)
      callback(err, null);

    });
}
module.exports = Message;
