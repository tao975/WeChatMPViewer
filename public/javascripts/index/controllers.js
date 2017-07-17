
angular.module('index.controllers', [])

.controller('mainCtrl', function($scope, $http) {

	$scope.articles = []; // 文章列表
    $scope.pms = []; // 公众号列表
	
	//  获取文章
	$scope.searchArticle = function(){
		$http({
            url: getRootPath() + '/index/searchArticles',
            method: 'get',
            params: {
                key : $("#searchword").val().trim()
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            $scope.articles = result;
            $("#pmList").hide();
            $("#met_card_list").show();
            if($scope.articles.length == 0) {
                $("#errMsg").html("查询不到文章！");
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("加载错误！");
        });
	}

    //  关注公众号
    $scope.addPM = function(pm){
        console.log(pm);

        $http({
            url: getRootPath() + '/index/addPM',
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
                $("#butt_guanzhu_" + pm.openid).val("已关注");
            }
            else {
                alert("系统错误！关注失败");
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("系统错误！关注失败");
        });

    }

    //  搜索公众号
    $scope.searchPM = function(){

        var key = $("#searchword").val().trim();
        if(key == undefined || key == "") {
            $("#errMsg").html("请输入关键字！");
        }
        else {
            $http({
                url: getRootPath() + '/index/searchPM',
                method: 'get',
                params: {
                    key : $("#searchword").val()
                }
            }).success(function (result,status,config,headers,statusText) { //响应成功
                $scope.pms = result;
                $("#met_card_list").hide();
                $("#pmList").show();
                if($scope.pms.length == 0) {
                    $("#errMsg").html("查询不到文章！");
                }
            }).error(function (data,status,config,headers,statusText) { //处理响应失败
                alert("加载错误！");
            });
        }

    }
	
	// 加载文章
	$scope.searchArticle();
	
	
})

.controller('mainCtrl', function($scope, $http) {

})
;