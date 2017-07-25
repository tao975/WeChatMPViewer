/**
 * 微信公众号文章数据库操作
 * 数据保存到MongoDB
 * Created by tao on 2017/7/11.
 */


var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/wechatpm';

/**
 * 保存公众号文章
 * article表对title建立唯一索引，不保存重复title的文章
 * @param article 公众号文章
 * @param callback 回调函数
 */
exports.saveArticle = function(article,callback){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 article
            var collection = db.collection('article');
            // 插入数据
            collection.updateOne({'title': article.title}, article, {upsert :true},function(err, result) {
                if(err)
                {
                    console.error('Error:'+ err);
                }
                if(callback){
                    callback(result);
                }
                db.close();
            });
        }
        else {
            console.error("连接失败！" + err);
        }
    });
}

/**
 * 保存多篇公众号文章
 * article表对title建立唯一索引，不保存重复title的文章
 * @param articles 公众号文章
 * @param callback 回调函数
 */
exports.saveArticles = function(articles){
    for(var i = 0; i < articles.length; i++) {
        exports.saveArticle(articles[i]);
    }
}

/**
 * 根据标题获取文章
 * @param title 标题
 * @param callback
 */
exports.getArticleByTitle = function(title,callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 article
            var collection = db.collection('article');
            // 查询数据
            var whereStr = {"title":title};
            collection.findOne(whereStr,function(err, result) {
                if(err)
                {
                    console.log('Error:'+ err);
                }
                if(callback){
                    callback(result);
                }
                db.close();
            });
        }
        else {
            console.error("连接失败！" + err);
        }
    });
}

/**
 * 关键字搜索文章
 * @param key 搜索关键字
 * @param pageIndex 页码
 * @param pageSize 每页条数
 * @param callback
 */
exports.getArticlesByKey = function(key,pageIndex,pageSize, callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 article
            var collection = db.collection('article');

            // 条件语句
            var whereStr = {}

            if(key != null && key != '') {
                whereStr = { $or: [
                    {title: {$regex:key}},
                    {openid:{$regex:key}},
                    {auth:{$regex:key}}
                ]};
            }

            if(isNaN(pageIndex)) {
                pageIndex = 1;
            }

            if(isNaN(pageSize)){
                pageSize = 0;
            }

            // 查询数据
            collection.find(whereStr).sort({datetime:-1}).skip((pageIndex-1)*pageSize).limit(pageSize).toArray(function(err, result) {
                if(err)
                {
                    console.log('Error:'+ err);
                }
                if(callback){
                    callback(result);
                }
                db.close();
            });
        }
        else {
            console.error("连接失败！" + err);
        }
    });
}