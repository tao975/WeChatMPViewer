/**
 * Created by tao on 2017/8/8.
 * 定时采集任务
 */

var articledb = require('../db/articledb');
var pmdb = require('../db/pmdb');
var schedule = require("node-schedule");
var sougongWeixinSpide = require("../spider/sougouWeixinSpider");
var moment = require("moment");

// 启动定时任务
exports.run = function(){
    //test();
    collectPMArticle();
}

// 定时采集公众号文章
function collectPMArticle(){
    console.log("启动采集文章定时任务");
    var hadCollectedPms = []; // 保存当天已采集过的公众号，避免重复采集
    var rule = new schedule.RecurrenceRule();
    //var jobtime = '0 0 1,7,9,12,15,18,20,23 * * *';
    var jobtime = '0 47 * * * *';
    var j = schedule.scheduleJob(jobtime, function(){  // 定时执行
        console.log("执行定时采集公众号文章任务，执行时间：" + moment().format('YYYYMMDD hh:mm:ss'));
        // var day = moment().format('YYYYMMDD');  // 当前日期
        pmdb.getPms(function(pms){
            var i = 0;
            // 每采集一个公众号需等待一段时间，再继续采集下一个公众号，避免采集频率过高
            var interval = setInterval(function(){
                if(!pms[i]) {
                    clearInterval(interval);
                    return;
                }
                var openid = pms[i].openid;
                var pmname = pms[i].name;
                if(hadCollectedPms.indexOf(openid) == -1) {

                    console.log("采集公众号["+pmname+"]的文章...");

                    sougongWeixinSpide.getArticlesByOpenid(openid,null,function(articles){

                        console.log("采集公众号["+pmname+"]文章数：" + (articles?articles.length:0) );

                        if(articles && articles.length > 0) {
                            articledb.saveArticles(articles,function(result){
                                hadCollectedPms.push(openid);
                                // 如果当前时间是23点，清空hadCollectedPms，下一天重新采集全部公众号
                                if(new Date().getHours() == 23){
                                    hadCollectedPms = [];
                                }
                            });
                        }
                    });
                }
                i++;
            }, 3000);
        })
    });
}

// 测试验证码时效是多长时间
function test(){
    var counter = 0;
    var myFunction = function(){
        console.log(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "：开始采集...");
        sougongWeixinSpide.getArticlesByOpenid('importnew',function(articles){
            console.log("采集公众号[牛男]文章数：" + (articles?articles.length:0) );
        });
        clearInterval(interval);
        counter += 10*60*1000;
        interval = setInterval(myFunction, counter);
    }
    var interval = setInterval(myFunction, counter);
}



