/**
 * 搜狗微信爬虫
 * Created by tao on 2017/7/10.
 */

var http = require('http');
var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var schedule = require("node-schedule");
var moment = require("moment");
var app = express();

/**
 *  关键字查询公众号
 */
exports.searchPMsByKey = function(key,callback){

    var searchUrl = "http://weixin.sogou.com/weixin?type=1&query="+encodeURI(key); // 查询公众号url

    var options = {
        hostname:'weixin.sogou.com',
        port:80,
        path:"/weixin?type=1&query="+encodeURI(key),
        method:'GET',
        headers:{
            'Host':'weixin.sogou.com',
            'Referer':'weixin.sogou.com',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }

    }


    //  查询公众号
    var req = http.request(options,function(res){
        var html=''; // 保存爬回来的页面
        res.on('data',function(data){
            html+=data;
        });
        res.on('end',function(){

            var pms = []; // 保存爬取到的公众号

            if(html.indexOf("gzh-box2") == -1){
                console.error("爬取公众号出错了！"); // 出现 302 Found 错误
                console.info(html);
            }
            else {
                // 使用cheerio解析html
                var $ = cheerio.load(html);

                $(".gzh-box2").each(function(i, elem) {
                    var pm = {
                        openid : $(this).find("label[name='em_weixinhao']").text().trim(),  // 公众号ID
                        name : $(this).find(".tit").children('a').text().trim(), // 公众号名称
                        img : $(this).find(".img-box").find("img").attr("src"), // 头像
                        desc : $(this).next() == undefined ? '' : $(this).next().children("dd").text(), // 介绍
                        auth : $(this).next().next() == undefined ? '' : $(this).next().next().children("dd").text(), // 微信认证
                        url : $(this).find(".tit").children('a').attr("href") // 链接
                    }
                    pms.push(pm);
                });
            }

            if(callback) {
                callback(pms);
            }

        });
    }).on('error', function(e) {
        console.error("searchPMsByKey error: " + e.message);
    });
    req.end();
}

/**
 *  按公众号ID查询公众号
 */
exports.getPMByOpenid = function(openid, callback){
    exports.searchPMsByKey(openid,function(pms){
        //console.log(pms);
        for(var i = 0; i < pms.length; i++) {
            if(pms[i].openid == openid) {
                //console.log(pms[i]);
                if(callback) {
                    callback(pms[i]);
                }
            }
        }
    });
}

/**
 *  关键字查询文章
 */
exports.searchArticlesByKey = function(key,pageIndex,callback){

    var searchUrl = "http://weixin.sogou.com/weixin?type=2&query="+encodeURI(key)+"page="+pageIndex; // 查询文章url

    var options = {
        hostname:'weixin.sogou.com',
        port:80,
        path:"/weixin?type=2&query="+encodeURI(key)+"&page="+pageIndex, // 查询文章url
        method:'GET',
        headers:{
            'Host':'weixin.sogou.com',
            'Referer':'weixin.sogou.com',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
        }
    }

    console.log(options);

    //  查询文章
    var req = http.request(options,function(res){
        var html=''; // 保存爬回来的页面
        res.on('data',function(data){
            html+=data;
        });
        res.on('end',function(){
            var articles = []; // 保存爬取到的文章

            if(html.indexOf("news-list") == -1){
                console.error("爬取文章出错了！"); // 出现 302 Found 错误
                console.info(html);
            }
            else {
                // 使用cheerio解析html
                var $ = cheerio.load(html);

                $(".news-list li").each(function(i, elem) {
                    var article = {
                        title : ncrToStr($(this).find("h3 a").html()), // 标题
                        pic : $(this).find("img").attr("src"), // 文章首图
                        url : $(this).find("a").attr("href"), // 文章链接
                        datetime : parseInt($(this).find(".s2").html().replace("<script>document.write(timeConvert('","").replace("'))</script>",""))*1000, // 发布时间
                        //openid : pm.openid,
                        auth : ncrToStr($(this).find(".account").html()),
                    }
                    articles.push(article);
                });
            }

            if(callback) {
                callback(articles);
            }

        });
    }).on('error', function(e) {
        console.error("searchArticlesByKey error: " + e.message);
    });
    req.end();
}


/**
 * 爬取所有公众号文章
 * 因为每个公众号的历史文章的连接有失效期，会过期，所以不能直接请求公众号历史文章的连接来获取历史文章
 * 处理方式：通过搜狗微信先搜索公众号，然后访问该公众号的历史文章列表，再解析文章
 * @param openid 公众号ID
 * @param day 日期，爬取指定日期的文章，yyyyMMdd
 * @param callback(articles)
 */
exports.getArticlesByOpenid = function(openid,day,callback){
    exports.getPMByOpenid(openid,function(pm){
        if(pm != null) {
            //  查询公众号文章
            http.get(pm.url,function(req,res) {
                var html = ''; // 保存爬回来的页面
                req.on('data', function (data) {
                    html += data;
                });
                req.on('end', function () {
                    //console.log(html);
                    var articles = []; // 保存爬取到的公众号文章
                    var res = html.match(/msgList.*;/g);
                    if(res != null && res.length > 0) {
                        //console.log(res[0].substring(10,res[0].length-1));
                        var json = eval('(' + res[0].substring(10,res[0].length-1) + ')');
                        // console.log(json);
                        for(var i = 0; i < json.list.length; i++) {

                            // 每天第一篇文章
                            var article = {
                                title : json.list[i].app_msg_ext_info.title, // 标题
                                subtitle : json.list[i].app_msg_ext_info.digest, // 副标题
                                pic : json.list[i].app_msg_ext_info.cover.replace(/&amp;/g,'&'), // 文章首图
                                url : 'https://mp.weixin.qq.com' + json.list[i].app_msg_ext_info.content_url.replace(/&amp;/g,'&'), // 文章链接
                                datetime : parseInt(json.list[i].comm_msg_info.datetime)*1000, // 发布时间
                                openid : pm.openid,
                                auth : pm.name
                            };

                            // 如果指定采集文章的时间，需判断是否是这天的文章
                            if(day) {
                                var articledate = moment(new Date(article.datetime)).format('YYYYMMDD');
                                if(day == articledate) {
                                    articles.push(article);
                                }
                            }
                            else {
                                articles.push(article);
                            }

                            // 每天后面几篇文章
                            for(var j = 0; j < json.list[i].app_msg_ext_info.multi_app_msg_item_list.length; j++) {
                                var article = {
                                    title : json.list[i].app_msg_ext_info.multi_app_msg_item_list[j].title, // 标题
                                    subtitle : json.list[i].app_msg_ext_info.multi_app_msg_item_list[j].digest, // 副标题
                                    pic : json.list[i].app_msg_ext_info.multi_app_msg_item_list[j].cover.replace(/&amp;/g,'&'), // 文章首图
                                    url : 'https://mp.weixin.qq.com' + json.list[i].app_msg_ext_info.multi_app_msg_item_list[j].content_url.replace(/&amp;/g,'&'), // 文章链接
                                    datetime : parseInt(json.list[i].comm_msg_info.datetime)*1000, // 发布时间
                                    openid : openid,
                                    auth : pm.name
                                };
                                // 如果指定采集文章的时间，需判断是否是这天的文章
                                if(day) {
                                    var articledate = moment(new Date(article.datetime)).format('YYYYMMDD');
                                    if(day == articledate) {
                                        articles.push(article);
                                    }
                                }
                                else {
                                    articles.push(article);
                                }
                            }
                        }

                    }
                    else if(html.indexOf("") > -1) {
                        console.error("爬取文章有误！需要输入验证码！");  // 访问太多次需要验证码，待处理
                    }
                    else {
                        console.error("爬取文章有误！");
                    }

                    //console.log(articles);
                    if(callback) {
                        callback(articles);
                    }

                });
            });
        }
    })
}

// NCR 转 字符串
function ncrToStr(ncrStr){
    if(!ncrStr) return "";
    var str = "";
    var patt = /&#.*?;/g;
    while(r = patt.exec(ncrStr))
    {
        // 获得16进制的码
        var hexcode = "0" + r[0].replace("&#", "").replace(";","");
        // 16进制转字符
        var text = String.fromCharCode(parseInt(hexcode,16))
        str += text;
    }
    return str;
}

// 获取验证码Cert
exports.getCert = function(){
    var cert = (new Date).getTime()+Math.random();
    console.log(cert);
}

// 发送验证码
exports.verifycode = function(cert,input){

    var params = JSON.stringify({
        'cert' : encodeURIComponent(cert),
        'input' : encodeURIComponent(input)
    });

    var options = {
        hostname: 'mp.weixin.qq.com',
        port: '443',
        path: '/mp/verifycode',
        method: 'post',
        headers: {
            //  'Cookie': 'wxtokenkey=97d7a529f26b6529a801c94d0e442cfddba17fe22e3a7e4fb57953ecf4bbe033; wxuin=530120360; pass_ticket=xYUStMdaSca5QUyQhMjTJMhJhTnjvhvsfqjNNdxmlbCfZ1jnvNCZVtos12tc7Niq; wap_sid2=CKj94/wBElxyS2tETmNFdy1RakpxVkdpZ0tWbndZTTEyUGdoWXJJNXBYTUc4d2F3R3RiRXBxZ3ptaXBsWkVoYU5JbU5IYURCeVowOUNXNmFOOTllSDlIbDdYSE1XcE1EQUFBfjC/zvrLBTgMQJRO',
            //'Accept-Encoding': 'gzip, deflate',
            //'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.556.400 QQBrowser/9.0.2524.400',
            'Accept-Language' : 'zh-CN,zh;q=0.8,en-us;q=0.6,en;q=0.5;q=0.4',
            'Host': 'mp.weixin.qq.com',
            'Content-Length': Buffer.byteLength(params),
            'Origin': 'https://mp.weixin.qq.com',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'Referer': 'https://mp.weixin.qq.com/profile?src=3&timestamp=1502763331&ver=1&signature=yP1t*DZflm8SG2qiqdLwSza3fufRftiGeXXyuKIh49TpuZckGR7o0ouasz10vwE6eRSpF8rrAxJFO405hK6jZA=='
        }
    };
    var req = https.request(options, function(res) {
        var result = "";
        res.on('data', function(data) {
            result += data;
        });
        res.on('end', function () {
            console.log(result);
        });
    }).on('error', function(e) {
        console.error(e);
    });

    req.write(params);

    req.end();

}