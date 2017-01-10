(function(angular) {
    'use strict';
    var module = angular.module('eschool_login', []);
    module.controller('ELoginController', ['$scope',
        '$location',
        'AuthService',
        function($scope, $location, AuthService) {
            $scope.openId = '';
            $scope.login = function(openId) {
                console.log('login', openId);
                AuthSerice.login(openId).then(function(user) {}, function() {
                    console.log(openId);
                });
            };
        }
    ]);
})(angular);
