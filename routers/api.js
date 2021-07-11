var express = require('express');
var router = express.Router();
var User = require('../models/User');
var ws = require('nodejs-websocket');

//统一返回格式
var responseData;


router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }

    next();
});

router.post('/user/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var phone = req.body.phone;
    var name = req.body.name;

    //用户名是否已被注册
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) { //如果数据库中已有该用户名
            responseData.code = 1;
            responseData.message = "用户名已存在";
            res.json(responseData);
            return;
        }

        //无重名，保存数据，注册成功
        var user = new User({
            username: username,
            password: password,
            email: email,
            phone: phone,
            name: name
        });
        return user.save();
    }).then(function (newUserInfo) {

        responseData.message = "注册成功";
        res.json(responseData);
    });
})

router.post('/user/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {

        if (!userInfo) {
            responseData.code = 3;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }

        responseData.message = "登录成功！";
        responseData.code = 0;
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;

    })
})


router.post('/user/checkusername', function (req, res, next) {
    var username = req.body.username;
    if (username == "") {
        responseData.code = 2;
        responseData.message = "用户名为空";
        res.json(responseData);
        return;
    }
    //用户名是否已被注册
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) { //如果数据库中已有该用户名
            responseData.code = 1;
            responseData.message = "用户名已存在";
            res.json(responseData);
            return;
        } else {
            responseData.code = 0;
            res.json(responseData);
            return;
        }
    });


})

router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    responseData.code = 0;
    res.json(responseData);
})

var server = ws.createServer(function (conn) {
    conn.on('text', function (str) {
        server.connections.forEach(function (conn) {
            var msg = JSON.parse(str);
            var time = new Date();
            var now = time.toLocaleString();
            if (!msg.isData) {
                var info = {
                    user: msg.user,
                    mes: msg.msg,
                    time: now,
                    isData:false

                }
            }else{
                var info={
                    user: msg.user,
                    mes: msg.file,
                    time: now,
                    isData:true
                }
            }
            m = JSON.stringify(info);
            conn.sendText(m);


        })
    });


    conn.on('close', function (code, reason) {
        // console.log("close");
    });
    conn.on('error', function (code, reason) {
        // console.log("error", reason);
    })
}).listen(8888); //chats

var users = new Array();
var onlineUser = ws.createServer(function (conn) {
    conn.on('text', function (str) {
        //console.log(str);
        users.push(str);
        console.log(users);
        var info = {
            stat: 'join',
            name: str,
            userList: users
        }
        var i = JSON.stringify(info);
        onlineUser.connections.forEach(function (conn) {
            conn.sendText(i);
        })
    })
    conn.on('close', function (code, reason) {
        var name = conn.headers.cookie.split(',')[1];
        var leaveUser = name.split('"')[3];
        users.splice(users.indexOf(name.split('"')[3]), 1);
        //  console.log('name',name.split('"')[3]);
        var info = {
            stat: 'leave',
            name: leaveUser,
            userList: users
        }
        var i = JSON.stringify(info);
        // console.log(i);
        onlineUser.connections.forEach(function (conn) {
            conn.sendText(i);
        })

        //console.log(users);
    })
    conn.on('error', function (code, reason) {
        // console.log("error", reason);
    })
}).listen(8963); //监听用户状态



module.exports = router;