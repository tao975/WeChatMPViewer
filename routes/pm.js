var express = require('express');
var https = require('https');
var articledb = require('../bin/db/articledb');
var pmdb = require('../bin/db/pmdb');
var spider = require('../bin/spider/sougouWeixinSpider');
var router = express.Router();

/**
 * 公众号管理页面
 */
router.get('/', function(req, res, next) {
    res.redirect("/pm.html");
});


/**
 *  查询公众号
 */
router.get('/searchPM', function(req, res, next) {
    var key = req.query.key;
    spider.searchPMsByKey(key,function (pms) {
        res.json(pms);
    });
});

/**
 *  关注公众号
 */
router.post('/followPM', function(req, res, next) {

    var usercode = req.session.user.usercode;

    var pm = {
        openid : req.query.openid, // 公众号
        name : req.query.name, // 公众号名称
        img : req.query.img, // 头像
        desc : req.query.desc, // 介绍
        auth : req.query.auth, // 微信认证
        url : req.query.url // 链接
    };

    // 保存公众号
    pmdb.savePM(pm, function(result){
        if(result.result.ok == 1) {
            // 保存用户和公众号关注关系
            pmdb.saveUserPM(usercode,pm.openid,pm.name,pm.img,function(result){
                if(result.result.ok == 1) {
                    res.send("success");
                }
                else {
                    res.send("error");
                }
            });

            // 关注公众号之后立即采集该公众号的文章
            spider.getArticlesByOpenid(pm.openid,null,function(articles){

                console.log("采集公众号["+pm.name+"]文章数：" + (articles?articles.length:0) );

                if(articles && articles.length > 0) {
                    articledb.saveArticles(articles,function(result){
                        
                    });
                }
            });
        }
        else {
            res.send("error");
        }
    })


});

/**
 *  取消关注公众号
 */
router.post('/cancelFollowPM', function(req, res, next) {

    var usercode = req.session.user.usercode;
    var pmOpenid = req.query.openid;

    // 删除用户和公众号关注关系
    pmdb.deleteUserPM(usercode,pmOpenid,function(result){
        if(result.result.ok == 1) {
            res.send("success");
        }
        else {
            res.send("error");
        }
    });

});


/**
 *  查询用户关注的公众号
 */
router.get('/searchUserFollowPM', function(req, res, next) {
    var usercode = req.session.user.usercode;
    pmdb.getPMByUsercode(usercode, function(userFollowPM){
        res.json(userFollowPM);
    })
});

module.exports = router;
