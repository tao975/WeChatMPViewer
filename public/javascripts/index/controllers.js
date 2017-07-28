
angular.module('index.controllers', [])

.controller('articleCtrl', function($scope, $http, $location) {

	$scope.articles = []; // 文章列表
    $scope.searchword = ""; // 搜索关键字
    $scope.pageIndex = 1; // 页码
    $scope.pageSize = 5; // 每页条数
    $scope.isScrollLoading = true; // 是否正在滚动加载文章，默认为true，因为第一次加载时如果为false会触发滚动加载函数，会重复加载
    $scope.isEnd = false; // 是否已加载到底部

	//  查询文章
	$scope.searchArticle = function(){

	    // 如果不是滚动加载，则是点击搜索，pageIndex设为1
        if(!$scope.isScrollLoading){
            $scope.pageIndex = 1;
        }

		$http({
            url: getRootPath() + '/article/searchArticles',
            method: 'get',
            params: {
                key : $scope.searchword.trim(),
                pageIndex : $scope.pageIndex,
                pageSize : $scope.pageSize
            }
        }).success(function (result,status,config,headers,statusText) { // 响应成功

            // 如果是滚动到页面底部加载文章，则追加文章，否则是搜索文章，要覆盖原来的文章列表
            if($scope.isScrollLoading) {
                $scope.articles = $scope.articles.concat(result);
                $scope.isScrollLoading = false;
            }
            else {
                $scope.articles = result;
            }

            if(result.length == 0) {
                $scope.isEnd = true;
            }

            if($scope.articles.length == 0){
                $("#errMsg").html("没有查询到文章！");
            }
            else {
                $("#errMsg").html("");
            }

            $("#met_card_list").show();

        }).error(function (data,status,config,headers,statusText) { // 处理响应失败
            alert("加载错误！");
        });
	}

    //  查询公众号
    $scope.searchPM = function(){
        window.location.href = getRootPath() + '/pm.html?searchword=' + $scope.searchword.trim();
    }

    // 页面滚动到底部触发函数，加载文章
    $scope.scrollLoad = function(){
        if($scope.isScrollLoading || $scope.isEnd) {  // 如果正在加载或已加载到全部文章则不继续加载
            return;
        }
        console.log("加载文章！");
        $scope.isScrollLoading = true;
        $scope.pageIndex++;
        $scope.searchArticle();
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

            // 等待1秒钟，等页面加载完之后，初始化拖拽手势代码
            setTimeout(function(){
                $scope.dragOnApp();
            },1000);
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("加载错误！");
        });
    }

    // 拖拽关注的公众号
    $scope.dragOnApp = function(){
        var dx,dy; // 保存div webkitTransform 坐标
        touch.on('.pm_div', 'touchstart', function(ev) {
            ev.preventDefault();
            // 因为选中div的子元素也会拖拽，所以要判断拖拽的元素是否是div，如果不是则指向div
            if(ev.target.tagName == "DIV") {
                var transform = ev.target.style.webkitTransform;
            }
            else {
                var transform = ev.target.parentNode.style.webkitTransform;
            }
            var transforms = transform.split(",");
            dx = transforms.length > 1 ? transforms[0].substring(12,transforms[0].indexOf("px")) : 0;
            dy = transforms.length > 1 ? transforms[1].substring(1,transforms[1].indexOf("px")) : 0;
        });
        touch.on('.pm_div', 'drag', function(ev) {
            var offx = parseFloat(dx) + ev.x + "px";
            var offy = parseFloat(dy) + ev.y + "px";
            // 因为选中div的子元素也会拖拽，所以要判断拖拽的元素是否是div，如果不是则指向div
            if(ev.target.tagName == "DIV") {
                ev.target.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
            }
            else {
                ev.target.parentNode.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
            }
        });
        touch.on('.pm_div', 'dragend', function(ev) {
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