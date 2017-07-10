/**
 * 爬取微信公众号文章
 * Created by tao on 2017/7/10.
 */

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://mp.weixin.qq.com/profile?src=3&timestamp=1499677545&ver=1&signature=dQMg4qztNaEc4Q*g6ETVpNXcvtbdMtw98seNMhJw31mfZtl9vRpgAFe71n9czYu67cIdIY1dlr2IMHbOC-UBEw==";
//初始url

function fetchPage(x) {     //封装了一层函数
    startRequest(x);
}


function startRequest(x) {
    //采用http模块向服务器发起一次get请求
    http.get(x, function (res) {
        var html = '';        //用来存储请求网页的整个html内容
        var titles = [];
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
console.log(html);
            var res = html.match(/msgList*/);
            console.log(res);
            //采用cheerio模块解析html
            var $ = cheerio.load(html);

            var articles = [];



            $('.weui_media_box').each(function(i, elem) {
                console.log($(this).text());
                var news_item = {
                    //获取文章的标题
                    title: $(this).find('.weui_media_title').text().trim(),
                    //获取文章的描述
                    desc: $(this).find('.weui_media_desc').text().trim(),
                    //获取文章发布的时间
                    time: $(this).find('.weui_media_extra_info').text().trim(),
                    //获取当前文章的url
                    link:  $(this).find("weui_media_title").attr('hrefs')
                };

                console.log(news_item);     // 输出
            });

        });

    }).on('error', function (err) {
        console.log(err);
    });

}


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

fetchPage(url);      //主程序开始运行