(function(angular) {
    'use strict';
    var module = angular.module('eschool_mine', ['ngRoute']);
    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/mine/main', {
            templateUrl: 'e_mine/view.html',
            controller: 'EMineController'
        }).when('/mine/main/order', {
            templateUrl: 'e_mine/order.html',
            controller: 'EMineOrderController'
        }).when('/mine/main/address', {
            templateUrl: 'e_mine/address.html',
            controller: 'EMineAddressController'
        }).when('/mine/main/contact', {
            templateUrl: 'e_mine/contact.html',
            controller: 'EMineContactController'
        }).when('/mine/main/about', {
            templateUrl: 'e_mine/about.html',
            controller: 'EMineAboutController'
        });
    }]);
    module.controller('EMineController', ['$scope', function($scope) {

    }]);
    module.controller('EMineOrderController', ['$scope', function($scope) {

    }]);
    module.controller('EMineAddressController', ['$scope', function($scope) {

    }]);
    module.controller('EMineContactController', ['$scope', function($scope) {

    }]);
    module.controller('EMineAboutController', ['$scope', function($scope) {

    }]);
})(angular);
