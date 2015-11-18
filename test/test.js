
var Client = require('../public/client.js')
var User = require('../models/User.js'); 
var expect = require('expect.js');
var sleep = require('sleep');
var Message = require('../models/Message.js');
//var requireHelper = require('../require_helper');
//var formValidator = requireHelper('form_validator');



/*function displayImage(user,datetime,status, imgData) {
        var container = document.getElementById('messagesAll');
        var statusStamp = getUserCurrentStatus(status);
         $('#messagesAll').append('<div class="well"><p class = "pull-left"><b>' + user + statusStamp + '</b></p><p class="dateTimeFormat pull-right"><b>' + datetime + '</b></p><br><div class="clearfix"></div><br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>' + '</div>');
        container.scrollTop = container.scrollHeight;
    }

    function initialEmoji() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 20; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    }*/



/*suite('displayImage test', function(){
    /*
     * test functions for send image
     */
     /*var msg = new msg('joan','2015-11-12 12:03', 'HELP', imgData);
        expect(mainpage.displayImage()).to.be.ok;
        done();

});*/

function get_date_string () {
  var date = new Date();
  var hr = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var day= (date.getDate()).toString();
  var month = (date.getMonth()+1).toString();
  var year = (date.getFullYear()).toString();
  var fullDate = year+'-'+month+'-'+day+' '+hr+':'+min;
  return fullDate;
}

function get_specified_date_string (year, month, day, hr, min) {
  var date = new Date(year, month, day, hr, min);
  var hr = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var day= (date.getDate()).toString();
  var month = (date.getMonth()+1).toString();
  var year = (date.getFullYear()).toString();
  var fullDate = year+'-'+month+'-'+day+' '+hr+':'+min;
  return fullDate;
}


suite('Send sticker test', function(){
    /*
     * Adding sticker.
     */
    test('Sending sticker', function(done){

        Message.saveMsg('publicmsg', "Bean", [emoji:8], 
                        get_specified_date_string(2015, 10, 10, 11, 10), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 
     

 test('Sending sticker', function(done){

        Message.saveMsg('publicmsg', "Bean", [emoji:2], 
                        get_specified_date_string(2015, 10, 10, 11, 10), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

 test('Sending sticker', function(done){

        Message.saveMsg('publicmsg', "Bean", [emoji:3], 
                        get_specified_date_string(2015, 10, 10, 11, 10), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 


 test('Sending sticker', function(done){

        Message.saveMsg('publicmsg', "Bean", [emoji:4], 
                        get_specified_date_string(2015, 10, 10, 11, 10), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
 

test('varify isSticker', function(done){
        var message = new Message("Bean", [emoji:5]);
        expect(message.get_message()).to.be([emoji:5]);
        done();
    });  

    }); 









    /*test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "NehaGoyal", "I like to paint", 
                        get_specified_date_string(2015, 10, 10, 11, 19), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 
    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "NehaGoyal", "Hi, I like to party", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Goldfish", "I like to swim", 
                        get_specified_date_string(2015, 10, 10, 11, 19), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 
    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Goldfish", "Hi, My name is Goldfish", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Tiger", "Hi, My name is Tiger", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Lion", "Hi, My name is Lion", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Zion", "Hi, My name is Zion", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Lion", "Let's start the chatroom", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding public message', function(done){

        Message.saveMsg('publicmsg', "Zion", "Let the chatroom be started", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    /*
     * Adding announcement messages.
     */
     
    /*test('Adding announcement message', function(done){
        Message.saveMsg('announcement', "NehaGoyal", "People are drowning", 
                        get_specified_date_string(2015, 10, 10, 11, 19), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 
    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "NehaGoyal", "Earthquake is coming save life", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding announcement message', function(done){
        Message.saveMsg('announcement', "Zion", "Tsunami is coming", 
                        get_specified_date_string(2015, 10, 10, 11, 18), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 
    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "Zion", "Go to Noah's Ark", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding announcement message', function(done){
        Message.saveMsg('announcement', "Lion", "A monster is roaming around", 
                        get_specified_date_string(2015, 10, 10, 11, 18), 
                        function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 
    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "Lion", "Water water every where", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "Tiger", "Water water every where but not a drop to drink", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "Tiger", "I am stuck in my den", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "Goldfish", "Fire is spreading in the jungle", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    test('Adding announcement message', function(done){

        Message.saveMsg('announcement', "Starfish", "I see glaciers", 
                        get_date_string(), function(err, return_code){
            expect(return_code).to.be(201);
            done();
        });
    }); 

    /*
     * So far, we have added 10 public messages 
     */
    /*test('Testing the number of public messages', function(done){
        Message.getAllMsgs("publicmsg", function(err, msgList){
            
            var number_of_public_messages = msgList.length;
            expect(number_of_public_messages).to.be(10);

            for (var i = 0; i < number_of_public_messages; ++i) {
                expect(msgList[i].username).to.be.a('string');
                expect(msgList[i].message).to.be.a('string');
                expect(msgList[i].datetime).to.be.a('string');
            }
            done();
        });
    });
    /*
     * So far, we have added 10 announcements
     */
   /* test('Testing the number of announcements', function(done){
        Message.getAllMsgs("announcement", function(err, msgList){
            
            var number_of_announcement = msgList.length;
            expect(number_of_announcement).to.be(10);

            for (var i = 0; i < number_of_announcement; ++i) {
                expect(msgList[i].username).to.be.a('string');
                expect(msgList[i].message).to.be.a('string');
                expect(msgList[i].datetime).to.be.a('string');
            }
            done();
        });
    });

    /*
     * Testing if given words occur in the public messages
     */
    /*test_string_words_public_1 = "start chatroom"
    test("Testing if the words " + test_string_words_public_1 + " occur in public messages", 
         function(done){
         var expected_message_list = ["Let the chatroom be started",
                                        "Let's start the chatroom"];
         var expected_message_sender_username = ["Zion", "Lion"];
         var number_of_expected_messages = expected_message_list.length;

         Message.getMatchingMsgs('publicmsg', test_string_words_public_1, 
                                 null, null,
                                 function(err, msgList){

            expect(msgList.length).to.be(number_of_expected_messages);

            for (var i = 0; i < msgList.length; ++i) {
                expect(msgList[i].username).to.be(
                                expected_message_sender_username[i]);
                expect(msgList[i].message).to.be(
                                expected_message_list[i]);
                expect(msgList[i].datetime).to.be.a('string');
            }
            done();
        });
    });

    /*
     * Testing if given words do occur in the public messages
     */
    /*test_string_words_public_2 = "start chatrooms"
    test("Testing if the words " + test_string_words_public_2 + " occur in public messages", 
         function(done){
         var expected_message_list = [];
         var expected_message_sender_username = [];
         var number_of_expected_messages = expected_message_list.length;

         Message.getMatchingMsgs('publicmsg', test_string_words_public_2,  
                                 null, null, 
                                 function(err, msgList){

            expect(msgList.length).to.be(number_of_expected_messages);

            done();
        });
    });

    /*
     * Testing search of no words in the public messages
     */
    /*test_string_words_public_3 = ""
    test("Testing if the words " + test_string_words_public_3 + " occur in public messages", 
         function(done){
         var expected_message_list = [];
         var expected_message_sender_username = [];
         var number_of_expected_messages = expected_message_list.length;

         Message.getMatchingMsgs('publicmsg', test_string_words_public_3, null, null, 
                                 function(err, msgList){

            expect(msgList.length).to.be(number_of_expected_messages);

            done();
        });
    });*/

    /*
     * Testing if given words occur in the announcements
     */
   /* test_string_words_announcement_1 = "water where"
    test("Testing if the words " + test_string_words_announcement_1 + " occur in announcements", 
         function(done){
         var expected_message_list = ["Water water every where but not a drop to drink", 
                                        "Water water every where",];
         var expected_message_sender_username = ["Tiger", "Lion"];
         var number_of_expected_messages = expected_message_list.length;

         Message.getMatchingMsgs('announcement', test_string_words_announcement_1, 
                                 null, null, 
                                 function(err, msgList){

            expect(msgList.length).to.be(number_of_expected_messages);

            for (var i = 0; i < msgList.length; ++i) {
                expect(msgList[i].username).to.be(
                                expected_message_sender_username[i]);
                expect(msgList[i].message).to.be(
                                expected_message_list[i]);
                expect(msgList[i].datetime).to.be.a('string');
            }
            done();
        });
    });

    /*
     * Testing if given words occur in the announcements
     */
    /*test_string_words_announcement_2 = "Fire"
    test("Testing if the words " + test_string_words_announcement_2 + " occur in announcements", 
         function(done){
         var expected_message_list = ["Fire is spreading in the jungle"];
         var expected_message_sender_username = ["Goldfish"];
         var number_of_expected_messages = expected_message_list.length;

         Message.getMatchingMsgs('announcement', test_string_words_announcement_2, 
                                 null, null, 
                                 function(err, msgList){

            expect(msgList.length).to.be(number_of_expected_messages);

            for (var i = 0; i < msgList.length; ++i) {
                expect(msgList[i].username).to.be(
                                expected_message_sender_username[i]);
                expect(msgList[i].message).to.be(
                                expected_message_list[i]);
                expect(msgList[i].datetime).to.be.a('string');
            }
            done();
        });
    });

    /*
     * Testing if given words occur in the announcements
     */
    /*test_string_words_announcement_3 = "iced"
    test("Testing if the words " + test_string_words_announcement_3 + " occur in announcements", 
         function(done){
         var expected_message_list = [];
         var expected_message_sender_username = [];
         var number_of_expected_messages = expected_message_list.length;

         Message.getMatchingMsgs('announcement', test_string_words_announcement_3, 
                                 null, null, 
                                 function(err, msgList){

            expect(msgList.length).to.be(number_of_expected_messages);

            done();
        });
    });
});



/*
suite('Message Testing', function(){
    
    test('Senders Name', function(done){
        var message = new Message("Neha123", "Hi, my name is Neha Goyal");
        expect(message.get_username()).to.be("Neha123");
        done();
    }); 

    test('Chat Message', function(done){
        var message = new Message("Neha123", "Hi, my name is Neha Goyal");
        expect(message.get_message()).to.be("Hi, my name is Neha Goyal");
        done();
    }); 

});
*/

/*suite('Client library Testing', function(){

    test('Testing function isWeak', function(done){
        expect(Client.isWeak("Gaurav", 9)).to.be.ok();
        done();
    });
});
*/
