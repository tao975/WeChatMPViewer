var express = require('express');
var https = require('https');
var articledb = require('../bin/db/articledb');
var pmdb = require('../bin/db/pmdb');
var spider = require('../bin/spider/spider');
var router = express.Router();


/**
 * 首页
 */
router.get('/', function(req, res, next) {
    res.redirect("article.html");
});

/**
 *  获取文章
 */
router.get('/searchArticles', function(req, res, next) {
    var key = req.query.key;
    articledb.getArticlesByKey(key, function(articles){
      res.json(articles);
    })
});


module.exports = router;
