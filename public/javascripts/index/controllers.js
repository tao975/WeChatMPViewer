
angular.module('index.controllers', [])

.controller('articleCtrl', function($scope, $http, $location) {

	$scope.articles = []; // 文章列表
    $scope.searchword = ""; // 搜索关键字
	
	//  查询文章
	$scope.searchArticle = function(){
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

    //  查询公众号
    $scope.searchPM = function(){
        window.location.href = getRootPath() + '/pm.html?searchword=' + $scope.searchword.trim();
    }

	// 初始化
	$scope.init = function(){
        $scope.searchword = $location.search().searchword || "";
        $scope.searchArticle();
    }

    $scope.init();

})

.controller('pmCtrl', function($scope, $http,$location) {

    $scope.userFollowPMs = []; // 用户关注的公众号列表
    $scope.userFollowPMOpenids = []; // 保存用户关注的公众号openid，用于判断是否已关注
    $scope.searchPMs = []; // 查询的公众号列表
    $scope.searchword = ""; // 搜索关键字
    $scope.isShowFollowPM = true;

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
                $scope.isShowFollowPM = false;
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

    // 显示已关注的公众号
    $scope.showFollowPM = function(){
        $("#searchPmList").slideToggle();
        $("#userFollowPMList").slideToggle();
        $scope.isShowFollowPM = !$scope.isShowFollowPM;
    }

    //  关注或取消关注公众号
    $scope.followPM = function(pm){

        var isFollow = $scope.userFollowPMOpenids.indexOf(pm.openid) == -1;  // 判断要关注还是取消关注

        if(isFollow) {  // 关注公众号
            $http({
                url: getRootPath() + '/pm/followPM',
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
                    // 如果列表中不存在则添加
                    if($scope.userFollowPMOpenids.indexOf(pm.openid) == -1) {
                        $scope.userFollowPMOpenids.push(pm.openid);
                    }
                    var flag = false;
                    for(var i = 0; i < $scope.userFollowPMs.length; i++){
                        if($scope.userFollowPMs[i].openid == pm.openid) {
                            flag = true;
                            break;
                        }

                    }
                    if(!flag){
                        $scope.userFollowPMs.push(pm);
                    }
                }
                else {
                    alert("系统错误！关注失败");
                }
            }).error(function (data,status,config,headers,statusText) { //处理响应失败
                alert("系统错误！关注失败");
            });
        }
        else {   // 取消关注公众号
            $http({
                url: getRootPath() + '/pm/cancelFollowPM',
                method: 'post',
                params: {
                    openid : pm.openid
                }
            }).success(function (result,status,config,headers,statusText) { //响应成功
                if(result == "success") {
                    // $scope.userFollowPMOpenids 列表中删除公众号，能够显示未关注的状态
                    $scope.userFollowPMOpenids.splice($scope.userFollowPMOpenids.indexOf(pm.openid),1);
                    // $scope.userFollowPMs 不删除该公众号是为了能够在关注的公众号页面中继续显示该公众号，方面能够继续选中
                    /*
                    for(var i = 0; i < $scope.userFollowPMs.length; i++) {
                        if($scope.userFollowPMs[i].openid == pm.openid) {
                            $scope.userFollowPMs.splice(i,1);
                        }
                    }
                    */
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
        $scope.searchword = $location.search().searchword;
        if($scope.searchword) {
            $scope.isShowFollowPM = false;
            $scope.searchPM();
        }
        else {
            $scope.isShowFollowPM = true;
        }
    }

    $scope.init();
})
;