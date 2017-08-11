var express = require('express');
var https = require('https');
var articledb = require('../bin/db/articledb');
var pmdb = require('../bin/db/pmdb');
var spider = require('../bin/spider/sougouWeixinSpider');
var router = express.Router();


/**
 * 首页
 */
router.get('/', function(req, res, next) {
    res.redirect("/login.html");
});


module.exports = router;
