var app = angular.module('top', []);

app.directive('top', function($rootScope) {
        return {
            templateUrl: 'top.html',
            controller: function($scope, $element,$http){

                // 登录的用户
                $scope.loginUser;

                //  查询文章
                $scope.searchArticle = function(){
                    if($scope.searchword == undefined || $scope.searchword.trim() == "") {
                        $("#errMsg").html("请输入关键字！");
                        return;
                    }
                    window.location.href = getRootPath() + '/article.html?searchword=' + $scope.searchword.trim();
                }

                //  查询公众号
                $scope.searchPM = function(){
                    if($scope.searchword == undefined || $scope.searchword.trim() == "") {
                        $("#errMsg").html("请输入关键字！");
                        return;
                    }
                    window.location.href = getRootPath() + '/pm.html?searchword=' + $scope.searchword.trim();
                }

                // 获取登录的用户
                $scope.getLoginUser = function(){
                    $http({
                        url: getRootPath() + '/user/getLoginUser',
                        method: 'get'
                    }).success(function (result,status,config,headers,statusText) { //响应成功
                        if(result && result != 'null') {
                            $scope.loginUser = result;
                        }
                        else {
                            window.location.href =  getRootPath() + "/login.html"
                        }
                    }).error(function (data,status,config,headers,statusText) { //处理响应失败
                        alert("加载错误！");
                    });
                }

                $scope.getLoginUser();
            },
        };
    }
);