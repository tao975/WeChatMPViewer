
angular.module('article.controllers', [])

.controller('articleCtrl', function($scope, $http, $location) {

    $scope.pmTypes = []; // 公众号分类列表
    $scope.selectedType = "全部"; // 选中的公众号
	$scope.articles = []; // 文章列表
    $scope.searchword = ""; // 搜索关键字
    $scope.pageIndex = 1; // 页码
    $scope.pageSize = 20; // 每页条数
    $scope.isScrollLoading = true; // 是否正在滚动加载文章，默认为true，因为第一次加载时如果为false会触发滚动加载函数，会重复加载
    $scope.isEnd = false; // 是否已加载到底部
    $scope.isSearch = false; // 是否搜索文章

    // 加载公众号分类
    $scope.loadPMTypes = function(){
        $http({
            url: getRootPath() + '/article/getPMTypes',
            method: 'get',
            params: {
            }
        }).success(function (result,status,config,headers,statusText) { // 响应成功
            $scope.pmTypes = result;
            $("#type_div").show();
        }).error(function (data,status,config,headers,statusText) { // 处理响应失败
            alert("加载错误！");
        });
    }

    // 选中分类
    $scope.selectType = function(type){
        $scope.selectedType = type;
        $("li").removeClass("active");
        $("#li_"+type).addClass("active");
        $scope.pageIndex = 1; // 页码
        $scope.loadArticles();
    }

    // 加载文章
    $scope.loadArticles = function(){
        $http({
            url: getRootPath() + '/article/loadArticles',
            method: 'get',
            params: {
                type : $scope.selectedType,
                pageIndex : $scope.pageIndex,
                pageSize : $scope.pageSize
            }
        }).success(function (result,status,config,headers,statusText) { // 响应成功
            // 如果是滚动到页面底部加载文章，则追加文章，否则要覆盖原来的文章列表
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
            $("#met_card_list").show();
        }).error(function (data,status,config,headers,statusText) { // 处理响应失败
            alert("加载错误！");
        });
    }

	//  查询文章
	$scope.searchArticles = function(){
        if($scope.searchword == undefined || $scope.searchword.trim() == "") {
            $("#errMsg").html("请输入关键字！");
            return;
        }
        if(!$scope.isSearch) { // 如果$scope.isSearch=false,则是第一次查询，pageIndex置为1,清空文章列表
            $scope.pageIndex = 1;
            $scope.isSearch = true;
            $scope.articles = [];
        }

		$http({
            url: getRootPath() + '/article/searchArticles',
            method: 'get',
            params: {
                key : $scope.searchword.trim(),
                pageIndex : $scope.pageIndex
            }
        }).success(function (result,status,config,headers,statusText) { // 响应成功

            // 如果是滚动到页面底部加载文章，则追加文章，否则覆盖原来的文章列表
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

    // 页面滚动到底部触发函数，加载文章
    $scope.scrollLoad = function(){
        if($scope.isScrollLoading || $scope.isEnd) {  // 如果正在加载或已加载到全部文章则不继续加载
            return;
        }
        $scope.isScrollLoading = true;
        $scope.pageIndex++;
        if($scope.isSearch) {
            $scope.searchArticles();
        }
        else {
            $scope.loadArticles();
        }
    }

    // 显示搜索框
    $scope.showSearchDiv = function($event){
        $('#met_search_box').slideDown();
        $event.stopPropagation();
    }

	// 初始化
	$scope.init = function(){
        $scope.loadPMTypes();
        $scope.searchword = $location.search().searchword;
        if($scope.searchword) {
            $scope.isSearch = true;
            $scope.searchArticles();
        }
        else {
            $scope.isSearch = false;
            $scope.loadArticles();
        }
    }

    $scope.init();

})

;