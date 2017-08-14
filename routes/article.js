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
    res.redirect("/article.html");
});

/**
 *  获取文章
 */
router.get('/loadArticles', function(req, res, next) {

    var type = req.query.type;
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

    // 只取该用户关注的公众号文章
    var usercode = req.session.user.usercode;
    pmdb.getPMByUsercode(usercode, function(userFollowPM){
        if(userFollowPM) {
            var openids = [];
            for(var i = 0; i < userFollowPM.pms.length; i++){
                if(!type || type == "全部" || type == userFollowPM.pms[i].type) {
                    if(userFollowPM.pms[i].isFollow) {
                        openids.push(userFollowPM.pms[i].openid);
                    }
                }
            }
            articledb.getArticlesByKey(openids,null,pageIndex,pageSize, function(articles){
                res.json(articles);
            })
        }
        else {
            res.json([]);
        }
    })


});

/**
 *  获取公众号分类
 */
router.get('/getPMTypes', function(req, res, next) {
    var usercode = req.session.user.usercode;
    pmdb.getPMTypes(usercode,function(types){
        res.json(types);
    });
});

/**
 *  搜索文章
 */
router.get('/searchArticles', function(req, res, next) {
    var key = req.query.key;
    var pageIndex = req.query.pageIndex;
    if(!pageIndex) {
        pageIndex = 1;
    }
    spider.searchArticlesByKey(key,pageIndex,function(articles){
        res.json(articles);
    });

});



module.exports = router;
