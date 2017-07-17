/**
 * 爬取微信公众号文章
 * Created by tao on 2017/7/10.
 */

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var articledb = require('../db/articledb');
var request = require('request');
var express = require('express');
var app = express();


/**
 *  关键字查询公众号
 */
exports.searchPMsByKey = function(key,callback){

    var searchUrl = "http://weixin.sogou.com/weixin?type=1&query="+encodeURI(key); // 查询公众号url
    //  查询公众号
    http.get(searchUrl,function(req,res){
        var html=''; // 保存爬回来的页面
        req.on('data',function(data){
            html+=data;
        });
        req.on('end',function(){
            // 使用cheerio解析html
            var $ = cheerio.load(html);
            var pms = []; // 保存爬取到的公众号
            console.log(html);
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
            if(callback) {
                callback(pms);
            }
        });
    });
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
 *  爬取公众号文章
 */
exports.getArticlesByOpenid = function(openid, callback){
    exports.getPMByOpenid(openid,function(pm){
        if(pm != null) {
            //  查询公众号文章
            http.get(pm.url,function(req,res) {
                var html = ''; // 保存爬回来的页面
                req.on('data', function (data) {
                    html += data;
                });
                req.on('end', function () {
                    // console.log(html);
                    // 使用cheerio解析html
                    var $ = cheerio.load(html);
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
                            articles.push(article);

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
                                articles.push(article);
                            }
                        }

                    }
                    else {
                        console.error("爬取文章有误！");  // 访问太多次需要验证码，待处理
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


/*
exports.getArticlesByOpenid('neonan01',function(articles){

    articledb.saveArticles(articles,function(result){
        console.log(result);
    });
});
*/




//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent($, news_title) {
    $('.article-content p').each(function (index, item) {
        var x = $(this).text();

        var y = x.substring(0, 2).trim();

        if (y == '') {
            x = x + '\n';
//将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
            fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
}


//该函数的作用：在本地存储所爬取到的图片资源
function savedImg($,news_title) {
    $('.article-content img').each(function (index, item) {
        var img_title = $(this).parent().next().text().trim();  //获取图片的标题
        if(img_title.length>35||img_title==""){
            img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url

//采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}