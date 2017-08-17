
angular.module('user.controllers', [])

.controller('userCtrl', function($scope,$http,$location) {

    $scope.msg;
    $scope.usercodeMsg = "";
    $scope.usernameMsg = "";

    // 登录
    $scope.doLogin = function(){
        $http({
            url: getRootPath() + '/user/doLogin',
            method: 'post',
            params: {
                usercode : $scope.usercode,
                password : toMD5($scope.password)  // MD5 加密
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            if(result.state == "1") {
                window.location.href = getRootPath() + "/article.html";
            }
            else {
                $scope.msg = result.msg;
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("系统错误！");
        });

        return false;
    }

    // 注册
    $scope.doRegister = function(){

        if($scope.usercodeMsg.length > 1 || $scope.usernameMsg.length > 1){
            return;
        }

        if($scope.password != $scope.confirmPass) {
            $scope.msg = "两次密码不一致，请重新输入";
            $scope.password = "";
            $scope.confirmPass = "";
            return;
        }

        $http({
            url: getRootPath() + '/user/doRegister',
            method: 'post',
            params: {
                username : $scope.username,
                usercode : $scope.usercode,
                password : toMD5($scope.password)  // MD5 加密
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            if(result.state == "1") {
                window.location.href = getRootPath() + "/article.html";
            }
            else {
                $scope.msg = result.msg;
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("系统错误！");
        });

        return false;
    }

    // 判断用户是否存在
    $scope.isExist = function(type,usercode){

        if(!usercode || usercode == "") {
            return;
        }

        $http({
            url: getRootPath() + '/user/isExist',
            method: 'get',
            params: {
                usercode : usercode
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            if(result == true) {
                if(type == 'usercode') {
                    $scope.usercodeMsg = "登录帐号已存在";
                }
                else {
                    $scope.usernameMsg = "用户名已存在";
                }
            }
            else {
                if(type == 'usercode') {
                    $scope.usercodeMsg = "";
                }
                else {
                    $scope.usernameMsg = "";
                }
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("系统错误！");
        });
    }

})


;