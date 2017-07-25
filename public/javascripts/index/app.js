var app = angular.module('index', ['index.controllers','infinite-scroll']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);