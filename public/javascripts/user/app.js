var app = angular.module('user', ['user.controllers']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);