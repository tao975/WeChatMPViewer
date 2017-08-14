var app = angular.module('article', ['article.controllers','infinite-scroll','top']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);