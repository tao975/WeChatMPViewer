var express = require('express');
var userdb = require('../bin/db/userdb');
var spider = require("../bin/spider/sougouWeixinSpider");
var router = express.Router();

/**
 * 跳转登录页面
 */
router.get('/', function(req, res, next) {
    res.redirect("/login.html");
});

/**
 * 跳转登录页面
 */
router.get('/login', function(req, res, next) {
    res.redirect("/login.html");
});

/**
 * 跳转注册页面
 */
router.get('/register', function(req, res, next) {
    res.redirect("/register.html");
});

/**
 * 用户登录
 */
router.post('/doLogin', function(req, res, next) {

    var usercode = req.query.usercode;
    var password = req.query.password;

    userdb.getUserByCode(usercode,function(user){
        var state = 0;
        var msg = "";
        if(user) {
            if(user.password == password){
                state = 1;
                // 保存用户到session
                req.session.user = user;
            }
            else {
                msg = "密码错误";
            }
        }
        else {
            msg = "不存在该用户";
        }

        res.json({"state":state,"msg":msg});
    });


});

/**
 * 用户注册
 */
router.post('/doRegister', function(req, res, next) {

    var username = req.query.username;
    var usercode = req.query.usercode;
    var password = req.query.password;
    var user = new Object();
    user.username = username;
    user.usercode = usercode;
    user.password = password;

    // 如果用户名是手机号，保存手机号
    if(/^1[34578]\d{9}$/.test(usercode))
    {
        user.phone = usercode;
    }
    // 如果用户名是邮箱，保存邮箱
    else if(/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(usercode))
    {
        user.email = usercode;
    }

    userdb.saveUser(user,function(result){
        // 保存用户到session
        req.session.user = user;
        res.json({"state":1,"msg":""});
    });

});


/**
 * 退出系统
 */
router.get('/logout', function(req, res, next) {

    req.session.user = null;
    res.redirect("/login.html");

});


/**
 * 判断用户是否存在
 */
router.get('/isExist', function(req, res, next) {

    var usercode = req.query.usercode;
    userdb.getUserByCode(usercode,function(user){
        if(user){
            res.send(true);
        }
        else {
            res.send(false);
        }
    });

});

/**
 * 获取已登录用户
 */
router.get('/getLoginUser', function(req, res, next) {

    if(req.session.user) {
        res.send(req.session.user.usercode);
    }
    else {
        res.send(null);
    }

});

/**
 * 验证码
 */
router.post('/verifycode', function(req, res, next) {

    console.log("发送验证码！");

    var cert = req.query.cert;
    var input = req.query.input;
    spider.verifycode(cert,input);

    res.redirect('/verifycode.html');


});

module.exports = router;
