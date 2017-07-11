/**
 * 微信公众号数据库操作
 * 数据保存到MongoDB
 * Created by tao on 2017/7/11.
 */


var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/wechatpm';

/**
 * 保存公众号
 * @param pm 公众号
 * @param callback 回调函数
 */
exports.savePM = function(pm,callback){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 pm
            var collection = db.collection('pm');
            // 插入数据
            collection.updateOne({"openid":pm.openid},pm,{upsert:true}, function(err, result) {
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
 * 根据ID获取公众号
 * @param openid 公众号ID
 * @param callback
 */
exports.getPMByOpenid = function(openid,callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 pm
            var collection = db.collection('pm');
            // 查询数据
            var whereStr = {"openid":openid};
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
