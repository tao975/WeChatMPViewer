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

/**
 * 获取公众号列表
 * @param callback
 */
exports.getPms = function(callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 pm
            var collection = db.collection('pm');
            // 查询数据
            var whereStr = {};
            collection.find(whereStr).toArray(function(err, result) {
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
 * 保存用户关注的公众号
 * @param usercode 用户帐号
 * @param pmOpenid 公众号openid
 * @param pmName 公众号名称
 * @param pmImg 公众号头像
 * @param callback
 */
exports.saveUserPM = function(usercode,pmOpenid,pmName,pmImg,callback){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 user_pm
            var collection = db.collection('user_pm');

            // 查询数据库是否存在这个用户的数据
            var whereStr = {"user":usercode};
            collection.findOne(whereStr,function(err, obj) {
                if(err)
                {
                    console.log('Error:'+ err);
                }
                else {
                    if(!obj) {  // 如果不存在该用户的数据则新增一条数据
                        obj = {
                            user: usercode,
                            pms: []
                        }
                    }
                    obj.pms.push({
                        openid : pmOpenid,
                        name : pmName,
                        img : pmImg
                    });
                    // 更新数据
                    collection.updateOne({"user":usercode},obj,{upsert:true}, function(err, result) {
                        if(err)
                        {
                            console.error('Error:'+ err);
                        }
                        if(callback){
                            callback(result);
                        }
                    });
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
 * 删除用户关注的公众号
 * @param usercode 用户帐号
 * @param pmOpenid 公众号openid
 * @param callback
 */
exports.deleteUserPM = function(usercode,pmOpenid,callback){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 user_pm
            var collection = db.collection('user_pm');

            var whereStr = {"user":usercode};
            collection.findOne(whereStr,function(err, obj) {
                if(err)
                {
                    console.log('Error:'+ err);
                }
                else if(obj) {
                    collection.updateOne({"user":usercode},{ $pull: {pms : {openid:pmOpenid}}}, function(err, result) {
                        if(err)
                        {
                            console.error('Error:'+ err);
                        }
                        if(callback){
                            callback(result);
                        }
                    });
                }
                else {
                    callback({result:{ok:1}});
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
 * 查询用户关注的公众号
 * @param  usercode 用户帐号
 * @param callback
 */
exports.getPMByUsercode = function(usercode,callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if(!err) {
            // 连接到表 user_pm
            var collection = db.collection('user_pm');
            var whereStr = {"user":usercode};
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