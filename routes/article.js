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
    res.redirect("article.html");
});

/**
 *  获取文章
 */
router.get('/searchArticles', function(req, res, next) {

    var key = req.query.key;  // 搜索关键字
    var pageIndex = req.query.pageIndex; // 页码
    var pageSize = req.query.pageSize; // 每页条数
    if(isNaN(pageIndex)) {
        pageIndex = 1;
    }
    else {
        pageIndex = parseInt(pageIndex);
    }
    if(isNaN(pageSize)) {
        pageSize = 20;
    }
    else {
        pageSize = parseInt(pageSize);
    }

    console.log("搜索文章：" + "key=" + key + ",pageIndex="+pageIndex+",pageSize="+pageSize);

    articledb.getArticlesByKey(key,pageIndex,pageSize, function(articles){
      res.json(articles);
    })
});


module.exports = router;
