var express = require('express');
var articledb = require('../bin/db/articledb');
var router = express.Router();


/**
 * 首页
 */
router.get('/', function(req, res, next) {
    res.redirect("index.html");
});

/**
 * 获取文章
 */
router.get('/index/articles', function(req, res, next) {
    articledb.getArticles(function(articles){
      res.json(articles);
    })
});

module.exports = router;
