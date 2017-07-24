
angular.module('index.controllers', [])

.controller('articleCtrl', function($scope, $http, $location) {

	$scope.articles = []; // 文章列表
    $scope.searchword = ""; // 搜索关键字
	
	//  查询文章
	$scope.searchArticle = function(){
	    alert($scope.searchword);
		$http({
            url: getRootPath() + '/article/searchArticles',
            method: 'get',
            params: {
                key : $scope.searchword.trim()
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            $scope.articles = result;
            $("#pmList").hide();
            $("#met_card_list").show();
            if($scope.articles.length == 0) {
                $("#errMsg").html("没有查询到文章！");
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("加载错误！");
        });
	}

	// 初始化
	$scope.init = function(){
        $scope.searchword = $location.search().searchword || "";
        console.log($scope.searchword);
        $scope.searchArticle();
    }

    $scope.init();

})

.controller('pmCtrl', function($scope, $http) {

    $scope.userFollowPMs = []; // 用户关注的公众号列表
    $scope.userFollowPMOpenids = [];
    $scope.searchPMs = []; // 查询的公众号列表
    $scope.searchword = ""; // 搜索关键字

    //  查询文章
    $scope.searchArticle = function(){
        window.location.href = getRootPath() + '/article.html?searchword=' + $scope.searchword.trim();
    }

    //  搜索公众号
    $scope.searchPM = function(){

        if($scope.searchword == undefined || $scope.searchword.trim() == "") {
            $("#errMsg").html("请输入关键字！");
        }
        else {
            $http({
                url: getRootPath() + '/pm/searchPM',
                method: 'get',
                params: {
                    key : $scope.searchword.trim()
                }
            }).success(function (result,status,config,headers,statusText) { //响应成功
                $scope.searchPMs = result;
                $("#searchPmList").show();
                $("#userFollowPMList").hide();
                if($scope.searchPMs.length == 0) {
                    $("#errMsg").html("没有查询到公众号！");
                }
            }).error(function (data,status,config,headers,statusText) { //处理响应失败
                alert("加载错误！");
            });
        }
    }

    // 查询用户关注的公众号
    $scope.searchUserFollowPM = function(){
        $http({
            url: getRootPath() + '/pm/searchUserFollowPM',
            method: 'get',
            params: {
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            $scope.userFollowPMs = result.pms;
            for(var i = 0; i < result.pms.length; i++) {
                $scope.userFollowPMOpenids.push(result.pms[i].openid);
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("加载错误！");
        });
    }

    //  关注或取消关注公众号
    $scope.followPM = function(pm){

        if($("#butt_guanzhu_" + pm.openid).val() == "关注") {
            $http({
                url: getRootPath() + '/index/followPM',
                method: 'post',
                params: {
                    openid : pm.openid, // 公众号
                    name : pm.name, // 公众号名称
                    img : pm.img, // 头像
                    desc : pm.desc, // 介绍
                    auth : pm.auth, // 微信认证
                    url : pm.url // 链接
                }
            }).success(function (result,status,config,headers,statusText) { //响应成功
                if(result == "success") {
                    //  $("#butt_guanzhu_" + pm.openid).val("已关注");
                    // $("#butt_guanzhu_" + pm.openid).css("background-color","#3ac8f3");
                    $scope.userFollowPMs.push(pm.openid);
                }
                else {
                    alert("系统错误！关注失败");
                }
            }).error(function (data,status,config,headers,statusText) { //处理响应失败
                alert("系统错误！关注失败");
            });
        }
        else {
            $http({
                url: getRootPath() + '/index/cancelFollowPM',
                method: 'post',
                params: {
                    openid : pm.openid
                }
            }).success(function (result,status,config,headers,statusText) { //响应成功
                if(result == "success") {
                    //  $("#butt_guanzhu_" + pm.openid).val("关注");
                    //  $("#butt_guanzhu_" + pm.openid).css("background-color","#2bc126");
                    $scope.userFollowPMs.splice($scope.userFollowPMs.indexOf(pm.openid),1);
                }
                else {
                    alert("系统错误！取消关注失败");
                }
            }).error(function (data,status,config,headers,statusText) { //处理响应失败
                alert("系统错误！取消关注失败");
            });
        }
    }

    // 初始化
    $scope.init = function(){
        // 加载用户关注的公众号
        $scope.searchUserFollowPM();
        $("#userFollowPMList").show();
    }

    $scope.init();
})
;