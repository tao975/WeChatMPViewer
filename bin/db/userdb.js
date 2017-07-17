/**
 * 用户数据库操作
 * 数据保存到MongoDB
 * Created by tao on 2017/7/11.
 */


var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/wechatpm';

/**
 * 保存用户
 * @param  user 用户
 * @param callback 回调函数
 */
exports.saveUser = function(user,callback){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 user
            var collection = db.collection('user');
            // 插入数据
            collection.updateOne({"openid":user.openid},user,{upsert:true}, function(err, result) {
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
 * 根据公众号ID或用户帐号或手机号查询用户
 * @param code 公众号ID或用户帐号或手机号
 * @param callback
 */
exports.getUserByCode = function(code,callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 user
            var collection = db.collection('user');
            // 查询数据
            var whereStr = { $or: [
                {usercode: {$regex:code}},
                {phone:{$regex:code}},
                {openid:{$regex:code}}
            ]};
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
 * 根据用户名查询用户
 * @param username 用户名
 * @param callback
 */
exports.getUserByUsername = function(username,callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 user
            var collection = db.collection('user');
            // 查询数据
            var whereStr = {"username":username};
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


var user = {
    openid : "tao289110312",
    username : "tao",
    usercode : "tao289110312",
    phone : "12345",
    password: "123"
}

exports.saveUser(user,function(result){
    console.log(user);
})
