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
    var key = req.query.key;  // 搜索关键字
    var pageIndex = req.query.pageIdnex; // 页码
    var pageSize = req.query.pageSize; // 每页条数
    if(isNaN(pageIndex)) {
        pageIndex = 1;
    }
    if(isNaN(pageSize)) {
        pageSize = 20;
    }
    articledb.getArticlesByKey(key,pageIndex,pageSize, function(articles){
      res.json(articles);
    })
});


module.exports = router;
