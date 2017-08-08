var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
    res.redirect("login.html");
});


router.get('/dologin', function(req, res, next) {

});

router.get('/register', function(req, res, next) {
    res.redirect("register.html");
});

module.exports = router;
