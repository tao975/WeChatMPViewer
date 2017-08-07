/**
 * Created by tao on 2017/8/7.
 * 微信公众号爬虫
 */

var https = require('https');
var cheerio = require('cheerio');
var articledb = require('../db/articledb');
var request = require('request');
var express = require('express');
var app = express();

/**
 *  爬微信公众号历史文章
 */
exports.spiderMP = function(){

    var searchUrl = "/mp/profile_ext?action=home&__biz=MzIyMjMyMjQxOA==&uin=NTMwMTIwMzYw&key=c969774f949c279b04f6d5084dcc41c47b7adcf46689aa839d41edb7d3eb36a026a3e581d86801b637423c65384b5b578318947f1fa7ead227a79ec4dd5e6181172e35f2a2644483b00c5040f7de30f0";
    var options = {
        hostname: 'mp.weixin.qq.com',
        port: '443',
        path: searchUrl,
        method: 'get',
        params : {
          //  action : 'home',
            __biz : 'MzIyMjMyMjQxOA==', // 公众号id，base64加密
          //  scene : '124',
            uin : 'NTMwMTIwMzYw',  // 固定值
            key : 'c969774f949c279b04f6d5084dcc41c47b7adcf46689aa839d41edb7d3eb36a026a3e581d86801b637423c65384b5b578318947f1fa7ead227a79ec4dd5e6181172e35f2a2644483b00c5040f7de30f0'  // key有 有效期，会过期
        },
        headers: {
            //  'Cookie': 'wxtokenkey=97d7a529f26b6529a801c94d0e442cfddba17fe22e3a7e4fb57953ecf4bbe033; wxuin=530120360; pass_ticket=xYUStMdaSca5QUyQhMjTJMhJhTnjvhvsfqjNNdxmlbCfZ1jnvNCZVtos12tc7Niq; wap_sid2=CKj94/wBElxyS2tETmNFdy1RakpxVkdpZ0tWbndZTTEyUGdoWXJJNXBYTUc4d2F3R3RiRXBxZ3ptaXBsWkVoYU5JbU5IYURCeVowOUNXNmFOOTllSDlIbDdYSE1XcE1EQUFBfjC/zvrLBTgMQJRO',
            //'Accept-Encoding': 'gzip, deflate',
            //'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.556.400 QQBrowser/9.0.2524.400',
            // 'Accept-Language' : 'zh-CN,zh;q=0.8,en-us;q=0.6,en;q=0.5;q=0.4'
        }
    };
    var req = https.get(options, function(res) {
        var html = "";
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function () {
            console.log(html);
        });
    }).on('error', function(e) {
        console.error(e);
    });
    req.end();

}

exports.spiderMP();
