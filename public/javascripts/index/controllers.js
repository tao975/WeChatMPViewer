
angular.module('index.controllers', [])



.controller('mainCtrl', function($scope, $http) {
	
	// 文章
	$scope.articles = [];
	
	// 获取文章
	$scope.loadArticles = function(){
		$http({
            url: getRootPath() + '/index/articles',
            method: 'get',
            params: {
            }
        }).success(function (result,status,config,headers,statusText) { //响应成功
			console.log(result);
            $scope.articles = result;
            $("#met_card_list").show();
        }).error(function (data,status,config,headers,statusText) { //处理响应失败
            alert("加载错误！");
        });
	}
	
	// 加载文章
	$scope.loadArticles();
	
	
})

.controller("loginCtrl", function($scope, $http) {

	$scope.username;
	$scope.password;
	$scope.newpassword;

	/*$scope.init = function(){
	 var browser=navigator.appName
	 var b_version=navigator.appVersion
	 var version=b_version.split(";");
	 var trim_Version=version[1].replace(/[ ]/g,"");
	 if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0")
	 {
	 alert("请勿使用IE8及以下版本的浏览器！");
	 }
	 else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")
	 {
	 alert("请勿使用IE8及以下版本的浏览器！");
	 }
	 else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0")
	 {
	 alert("请勿使用IE8及以下版本的浏览器！");
	 }
	 }
	 */
	// 登录
	$scope.login = function(){
		if($scope.username == ''||$scope.username == undefined){
			alert("请输入用户名！");
			return;
		}
		if($scope.password == ''||$scope.password == undefined){
			alert("请输入密码！");
			return;
		}
		$http({
			url: getRootPath() + '/authority/login/login.do?timestamp=' + new Date().getTime(),
			params: {
				'username': $scope.username,
				'password': toMD5($scope.password)
			}
		}).success(function (result,status,config,headers,statusText) { //响应成功
			if (result.result == 'success') {
				window.location.href = "main.html";
			} else {
				// 首次登录修改密码
				if(result.result == 'newLogin') {
					alert("首次登录请修改密码");
					$scope.showChangePassword();
				}
				else {
					alert(result.result);
				}
			}
		}).error(function (data,status,config,headers,statusText) { //处理响应失败
			alert("出错了！");
		});
		/*
		 $.post( getRootPath() + '/authority/login/login.do', { username: $scope.username, password: toMD5($scope.password) } )
		 .success(function(result) {  if (result.result == 'success') {
		 window.location.href = "main.html";
		 } else {
		 // 首次登录修改密码
		 if(result.result == 'newLogin') {
		 alert("首次登录请修改密码");
		 $scope.showChangePassword();
		 }
		 else {
		 alert(result.result);
		 }
		 }})
		 .error(function() { alert("出错了！"); });
		 */
	}

	// 显示修改密码
	$scope.showChangePassword = function(){
		$("#tr_newPassword").show();
		$("#tr_loginBtn").hide();
		$("#tr_changePasswordBtn").show();
	}

	// 取消修改密码
	$scope.cancelChangePassword = function(){
		$("#tr_newPassword").hide();
		$("#tr_loginBtn").show();
		$("#tr_changePasswordBtn").hide();
	}

	// 修改密码
	$scope.changePassword = function(){
		if($scope.username == ''||$scope.username ==undefined){
			alert("请输入用户名！");
			return;
		}
		if($scope.password == ''||$scope.password == undefined){
			alert("请输入密码！");
			return;
		}
		if($scope.new_password == ''||$scope.new_password == undefined){
			alert("请输入新密码！");
			return;
		}
		//alert("111");
		var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
		if(!reg.test($scope.new_password) || $scope.new_password.length <8){
			alert("密码必须为字母加数字且长度不小于8位！");
			return;
		}
		$http({
			url: getRootPath() + '/authority/login/change_password.do',
			method: 'post',
			params: {
				'username': $scope.username,
				'password': toMD5($scope.password),
				'new_password' : toMD5($scope.new_password),
			}
		}).success(function (result,status,config,headers,statusText) { //响应成功
			if (result.result == 'success') {
				alert("成功修改密码！");
				$scope.cancelChangePassword();
			} else {
				alert(result.result);
			}
		}).error(function (data,status,config,headers,statusText) { //处理响应失败
			alert("出错了！");
		});
		/*
		 $.post(getRootPath() + '/authority/login/change_password.do',{username:$scope.username,password:toMD5($scope.password),new_password:toMD5($scope.new_password)})
		 .success(function(result){
		 if (result.result == 'success') {
		 alert("成功修改密码！");
		 $scope.cancelChangePassword();
		 } else {
		 alert(result.result);
		 }
		 }).error(function(){
		 alert("出错了！");
		 });
		 */
	}

	//$scope.init();

})

;
