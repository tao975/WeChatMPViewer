/**
 * Created by tao on 2017/7/31.
 * 验证码识别
 */


var http = require('http');
var request = require('request');
var cv = require('opencv');  // opencv 预处理图片

/**
 * 获取搜狗微信验证码
 */
function getVerifycode(){
    for(var i = 1; i <= 100; i++){
        request("https://mp.weixin.qq.com/mp/verifycode?cert=1501212308903.4024").pipe(fs.createWriteStream('C:/Users/tao/Desktop/验证码/'+i+'.jpg'));
    }
}

/**
 * 加载及保存图片 + 矩阵
 */
function readImg(){
    cv.readImage('/images/1.jpg', function(err, img) {
        if (err) {
            throw err;
        }

        const width = im.width();
        const height = im.height();

        if (width < 1 || height < 1) {
            throw new Error('Image has no size');
        }

        // do some cool stuff with img

        // save img
        img.save('/images/1_new.jpg.jpg');
    });
}

readImg();



