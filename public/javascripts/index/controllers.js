
angular.module('index.controllers', [])

.controller('articleCtrl', function($scope, $http, $location) {

    $scope.pmTypes = []; // 公众号分类列表
    $scope.selectedType = "全部"; // 选中的公众号
	$scope.articles = []; // 文章列表
    $scope.searchword = ""; // 搜索关键字
    $scope.pageIndex = 1; // 页码
    $scope.pageSize = 5; // 每页条数
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

    //  查询公众号
    $scope.searchPM = function(){
        if($scope.searchword == undefined || $scope.searchword.trim() == "") {
            $("#errMsg").html("请输入关键字！");
            return;
        }
        window.location.href = getRootPath() + '/pm.html?searchword=' + $scope.searchword.trim();
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

.controller('pmCtrl', function($scope, $http,$location) {

    $scope.userFollowPMs = new Object(); // 用户关注的公众号列表
    $scope.userFollowPMOpenids = []; // 保存用户关注的公众号openid，用于判断是否已关注
    $scope.searchPMs = []; // 查询的公众号列表
    $scope.searchword = ""; // 搜索关键字
    $scope.isShowFollowPM = false; // 是否显示关注公众号列表
    $scope.isShowTypeInput = false; // 是否显示分类输入框

    //  查询文章
    $scope.searchArticle = function(){
        if($scope.searchword == undefined || $scope.searchword.trim() == "") {
            $("#errMsg").html("请输入关键字！");
            return;
        }
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
           // $scope.userFollowPMs = result.pms;
            for(var i = 0; i < result.pms.length; i++) {
                if(result.pms[i].isFollow) {
                    $scope.userFollowPMOpenids.push(result.pms[i].openid);
                }
                if(!$scope.userFollowPMs[result.pms[i].type]){
                    $scope.userFollowPMs[result.pms[i].type] = new Array();
                }
                $scope.userFollowPMs[result.pms[i].type].push(result.pms[i]);
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
                    url : pm.url, // 链接
                    type : pm.type || '未分类'  // 分类
                }
            }).success(function (result,status,config,headers,statusText) { //响应成功
                if(result == "success") {
                    // 如果列表中不存在则添加
                    if($scope.userFollowPMOpenids.indexOf(pm.openid) == -1) {
                        $scope.userFollowPMOpenids.push(pm.openid);
                    }

                    var isExist = false;
                    for(var type in $scope.userFollowPMs){
                        for(var i = 0; i < $scope.userFollowPMs[type].length; i++) {
                            if(pm.openid == $scope.userFollowPMs[type][i].openid) {
                                isExist = true;
                                break;
                            }
                        }
                    }
                    if(!isExist) {
                        if(!$scope.userFollowPMs['未分类']) {
                            $scope.userFollowPMs['未分类'] = new Array();
                        }
                        $scope.userFollowPMs['未分类'].push(pm);
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
                    // $scope.userFollowPMs 不删除该公众号是为了能够在关注的公众号页面中继续显示该公众号，方面能够继续选中进行关注
                    $scope.userFollowPMOpenids.splice($scope.userFollowPMOpenids.indexOf(pm.openid),1);
                }
                else {
                    alert("系统错误！取消关注失败");
                }
            }).error(function (data,status,config,headers,statusText) { //处理响应失败
                alert("系统错误！取消关注失败");
            });
        }
    }

    // 显示分类输入框
    $scope.showAddType = function(){
        $scope.isShowTypeInput = true;
        $("#addTypeInput").focus();
    }

    // 增加分类
    $scope.addType = function(){
        var type = $("#addTypeInput").val().trim();
        if(type.length > 1) {
            $scope.userFollowPMs[type] = new Array();
            $("#addTypeInput").val("");
        }
        $scope.isShowTypeInput = false;
    }

    // 拖拽关注的公众号进行分类
    $scope.dragOnApp = function(){
        var target;
        var dx,dy; // 保存 div 坐标
        var typeDivTop = new Object(); // 保存每个分别div的位置
        var oldType; // 原公众号分类
        var selectedTypeDiv; // 选中的分类
        touch.on('.pm_div', 'dragstart', function(ev) {
            ev.preventDefault();

            // 因为选中div的子元素也会拖拽，所以要判断拖拽的元素是否是div，如果不是则指向div
            if(ev.target.tagName == "DIV") {
                target = ev.target;
            }
            else {
                target = ev.target.parentNode;
            }

            dx = $(target).offset().left;
            dy = $(target).offset().top;

            // DIV 浮起
            target.style.left = dx + "px";
            target.style.top = dy + "px";
            target.style.position = "absolute";
            target.style["z-index"] = "100";
            target.style["background-color"] = "#eae9e9";
            target.style["height"] = "60px";
            if($(target).parent().attr("id")) {
                oldType = $(target).parent().attr("id").substring(11);
            }
            $(target).appendTo($("body"));

            // 收起公众号列表，只显示分类
            $(".pmlist_div").slideUp(function(){
                // 保存每个分类div的位置
                $(".type_div").each(function(){
                    typeDivTop[$(this).attr('id').substring(9)] = $(this).offset().top;
                });
            });


        });
        touch.on('.pm_div', 'drag', function(ev) {

            if(!target) return;

            target.style.left = dx + ev.x + "px";
            target.style.top = dy + ev.y + "px";
            var targetY = dy + ev.y;
            // 拖拽到分类框，凸显分类框
            var flag = false;
            for(var type in typeDivTop) {
                if(targetY >= typeDivTop[type]  && targetY <= typeDivTop[type] + 40){
                    $("#type_div_"+type).css("box-shadow","0px 2px 15px 0px #a3afb7");
                    selectedTypeDiv = type;
                    flag = true;
                }
                else {
                    $("#type_div_"+type).css("box-shadow","");
                }
            }
            if(!flag) {
                selectedTypeDiv = oldType;
            }

        });
        touch.on('.pm_div', 'dragend', function(ev) {
            if(!target) return;
            // 收起关注的公众号
            $(".pmlist_div").slideDown();
            target.style.left = "0";
            target.style.top = "0";
            target.style.position = "relative";
            target.style["z-index"] = "0";
            target.style["background-color"] = "";
            target.style["height"] = "100px";
            $(".type_div").css("box-shadow","");

            if(selectedTypeDiv) {
                // 更新公众号分类
                $http({
                    url: getRootPath() + '/pm/updatePMType',
                    method: 'post',
                    params: {
                        openid : $(target).attr("id").substring(7),
                        type : selectedTypeDiv
                    }
                }).success(function (result,status,config,headers,statusText) { //响应成功

                }).error(function (data,status,config,headers,statusText) { //处理响应失败
                    alert("系统错误！分类失败");
                });
            }
            else {
                selectedTypeDiv = oldType;
            }

            $(target).insertBefore($("#clear_div_"+selectedTypeDiv));


            selectedTypeDiv = null;

        });

    }

    // 监听userFollowPMs，监听用户关注的公众号是否有变化，重新初始化dragOnApp()，使新增的关注公众号能够拖拽
    $scope.$watch('userFollowPMs',function(newValue,oldValue){
        // 等待1秒钟，等页面DOM加载完之后，初始化拖拽手势代码
        setTimeout(function(){
            $scope.dragOnApp();
        },1000);
    },true);

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

.controller('userCtrl', function($scope,$http,$location) {

    $scope.msg;

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

        if($scope.msg == "用户已存在"){
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
    $scope.isExist = function(){

        if(!$scope.usercode || $scope.usercode == "") {
            return;
        }

        $http({
            url: getRootPath() + '/user/isExist',
            method: 'get',
            params: {
                usercode : $scope.usercode
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
            if(result == true) {
                $scope.msg = "用户已存在";
            }
            else {
                $scope.msg = "";
            }
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("系统错误！");
        });
    }

})
;