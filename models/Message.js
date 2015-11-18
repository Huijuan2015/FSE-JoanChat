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
//    db.serialize(function() 
//     {
//       stmt = db.prepare("INSERT INTO USERMESSAGEHISTORY VALUES (?,?,?,?)");

//       stmt.run(null, username, message, datetime);
//        stmt.finalize();
//     });
//  callback(err, true);
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
      
       // console.log("row name: "+ row.USERNAME+"message: "+ row.MESSAGE+"status:"+row.STATUS);
        msgList.push(msgInfo);

      });

      callback(null, msgList);
    }
    if (err)
      callback(err, null);
  });
  msgList = [];
};


Message.searchPubMsg = function(keyword, callback)
{
    var msgList = [];
    console.log("Getting " + keyword + "s list...");

    var query;
    query = "SELECT USERNAME, MESSAGE, DATETIME, STATUS  FROM USERPUBLICMESSAGEHISTORY  WHERE MESSAGE LIKE '%"+keyword+"%' limit 50";
    console.log("searchPubMsg....querying is :"+query);
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
                msgInfo.status=row.STATUS;

                // console.log("row name: "+ row.USERNAME+"message: "+ row.MESSAGE+"status:"+row.STATUS);
                msgList.push(msgInfo);

            });

            callback(null, msgList);
        }
        if (err)
            callback(err, null);
    });
    msgList = [];
};

Message.searchAnnocement=function(keyword,callback){
    var msgList = [];
    console.log("Getting " + keyword + "s ananocement...");

    var query;
    //INSERT INTO USERANNOUNCEMENTHISTORY(ID, USERNAME, MESSAGE, DATETIME)
    query = "SELECT USERNAME, MESSAGE, DATETIME  FROM USERANNOUNCEMENTHISTORY  WHERE MESSAGE LIKE '%"+keyword+"%' limit 10";
    console.log("search annocement....querying is :"+query);
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


                // console.log("row name: "+ row.USERNAME+"message: "+ row.MESSAGE+"status:"+row.STATUS);
                msgList.push(msgInfo);

            });

            callback(null, msgList);
        }
        if (err)
            callback(err, null);
    });
    msgList = [];
}


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
        //JOAN
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

Message.searchPrivateMsgs = function(keyword, callback)
{
    var msgList = [];
    console.log("searchPrivateMsgs with keyword: " + keyword );

    var query;
    query = 'SELECT SENDERUSERNAME, RECEIVERUSERNAME, MESSAGE, DATETIME , STATUS FROM USERPRIVATEMESSAGEHISTORY WHERE MESSAGE LIKE "%'+keyword+'%"' ;
    console.log("searchpriMsg....querying is :"+query);
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
                // console.log("row name: "+ row.USERNAME+"message: "+ row.MESSAGE+"status:"+row.STATUS);
                msgList.push(msgInfo);
            });
            callback(null, msgList);
        }
        if (err)
            callback(err, null);
    });
    msgList = [];
};
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

Message.saveAnnoucement = function( username, message, datetime, callback)
{
    console.log("save " + message);

    var statement;
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
