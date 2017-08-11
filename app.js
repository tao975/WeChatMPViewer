var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var index = require('./routes/index');
var article = require('./routes/article');
var pm = require('./routes/pm');
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// 引入session , 这段代码需要放在routes前面，不然route获取不到session
app.use(session({
    secret: '12345', // 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
    name: 'pmviewer',   // cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 30 * 60 * 1000},  // session和相应的cookie失效过期时间
    resave: false, // 即使 session 没有被修改，也保存 session 值，默认为 true。
    saveUninitialized: true //
}));

// 权限限制，强制用户登录
app.use(function (req, res, next) {
    if (req.path.indexOf("top") > -1 || req.path.indexOf("footer") > -1 || req.path.toLowerCase().indexOf("login") > -1 || req.path.toLowerCase().indexOf("register") > -1 || req.path.indexOf(".js") > -1 || req.path.indexOf(".css") > -1 ||  req.path.indexOf(".map") > -1 ||  req.path.indexOf(".png") > -1 ||  req.path.indexOf(".jpg") > -1 ||  req.path.indexOf(".ico") > -1 ||  req.path.indexOf("isExist") > -1) {
        return next();
    }
    else if (req.session.user) {
        console.log("访问的用户："+req.session.user.usercode);
        return next();
    }
    else {
        console.error("用户还未登录！");
        return res.redirect("/login.html");
        next();
    }
});

// 引入静态文件
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/article', article);
app.use('/pm', pm);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
