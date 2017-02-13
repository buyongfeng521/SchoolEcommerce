(function(angular) {
    'use strict';
    var module = angular.module('eschool_login', ['ngRoute']);
    /*定义路由*/
    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login?code=:code', {
            templateUrl: 'e_login/view.html',
            controller: 'ELoginController'
        });
    }]);

    module.controller('ELoginController', ['$scope',
        '$route',
        '$routeParams',
        '$location',
        function($scope, $route, $routeParams, $location) {
            var code = $routeParams.code;
            console.log(code);
        }
    ]);
})(angular);
