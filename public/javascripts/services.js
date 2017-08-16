angular.module('services', [])
    // 提示框公共类
    .factory('MessageBox', function () {
        var scope;
        var ionicPopup;
        var timeout;
        var ionicLoading;

        return {
            // 初始化
            setScope: function($scope){
                scope = $scope;
                return this;
            },
            setPopup: function($ionicPopup){
                ionicPopup = $ionicPopup;
                return this;
            },
            setLoading: function($ionicLoading){
                ionicLoading = $ionicLoading;
                return this;
            },
            setTimeout: function($timeout){
                timeout = $timeout;
                return this;
            },
            // 显示对话框
            alert: function (message) {
                var alertPopup = ionicPopup.alert({
                    title: '系统提示',
                    template: message
                });
                timeout(function () {
                    alertPopup.close(); //3秒后关闭弹出
                }, 3000);
            },
            // 显示加载框
            loading: function() {
                ionicLoading.show({
                    template: '加载数据...'
                });
            },
            // 隐藏加载框
            hideLoading: function() {
                ionicLoading.hide();
            }
        };
    })
;
