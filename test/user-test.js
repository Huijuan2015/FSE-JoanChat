var expect = require('expect.js');
var user = require('../models/User.js')

suite('User Testing', function(){

//initial test
	var sqlite3 = require("sqlite3").verbose();
    var file = "../controllers/SSNOC.DB";
    var DB = new sqlite3.Database(file);
    //user = new User(DB);
	/*//test 1: getSingleUser
    test('getSingleUser', function(done){
        var timestamp = Date.parse(new Date());
        var user = {
            username : "test"+timestamp,
            password : md5("1111")
        };
        userDao.addNewUser(user, function(isSuccessed){
            //expect(isSuccessed).to.be.ok();
        });
        userDao.getSpecificUser("username="+user.username, function(rows){
            console.log("rows:"+rows);
            expect(rows[0].username).to.contain(user.username);
        });
        done();
    });*/

    //test 2: getAllUser
    test('getAllUser', function(done){
        User.getAllUser(function(userList) {
            //console.log("length:"+userList.length);
            expect(userList.length).to.be.above(0);
            for (var i=0;i < userList.length; i++){
                expect(userList[i].username).to.be.a('string');
                expect(userList[i].isAdmin).to.be.a('string');
                expect(userList[i].isOnline).to.be.a('number');
                expect(userList[i].status).to.be.a('string');
                expect(userList[i].statusTime).to.be.a('number');
                expect(userList[i].createdAt).to.be.a('number');
                //expect(userList[i].lastLoginAt).to.be.a('number');
            }
        });
        done();
    });

    //test 3: updateOnline
    /*test('3.updateStatus',function(done){
        var timestamp = Date.parse(new Date());
        var user = {
            username : "test"+timestamp,
            password : md5("1111")
        };
        userDao.addNewUser(user, function(isSuccessed){
            //expect(isSuccessed).to.be.ok();
        });
        userDao.updateOnline(user.username,0);
        userDao.getSpecificUser("username="+user.username, function(rows){
            console.log("rows:"+rows);
            expect(rows[0].is_online).to.be(0);
        });
        done();
    });*/

    //test 2: updateOnline
    /*test('updateOnline', function(done){
        var userdao = new UserDao(db);
        var user = {
            username : test+timestamp,
            password : md5(111111)
        };
        userdao.addNewUser(user);
        userdao.updateOnline(user.username,0);

        done();
    });*/
    
});

