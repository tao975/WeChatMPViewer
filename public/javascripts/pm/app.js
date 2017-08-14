var app = angular.module('pm', ['pm.controllers','top']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);