'use strict'

angular.module('eschool', [
        'ngRoute',
        'ngCookies',
        'angular-popups',
        'eschool_category',
        'eschool_cart',
        'eschool_mine',
        'eschool_login',
        'eschool.directives.autofocuscategory',
        'eschool.directives.autofocusmenu',
        'eschool.directives.goodsselected',
        'eschool.directives.logindialog'
    ])
    /*为模块定义一些常量*/
    .constant('AppConfig', {
        pageSize: 10,
        eschoolAPI: 'http://42.96.206.46:8010/api/'
    })
    .config(['$routeProvider', 'PopupProvider', function($routeProvider, PopupProvider) {
        $routeProvider.otherwise({ redirectTo: '/category/default' });

        PopupProvider.title = '提示';
        PopupProvider.okValue = '确定';
        PopupProvider.cancelValue = '取消';
    }])
    .factory('AuthService', ['$cookies', '$http','$q', 'AppConfig', function($cookies, $http,$q, AppConfig) {
        var authSer = {};

        authSer.login = function(openid) {
            var token = '';
            var deferred = $q.defer();
            $http.post(AppConfig.eschoolAPI + 'Mine/LoginWX', {
                'open_id': openid
            }).then(function(res) {
                token = res.data.Data;
                deferred.resolve(token)

                $cookies.put('SEUserToken', token, { expires: new Date(new Date().getTime() + 31536000000) });
                /*$scope.$emit("tokenEvent", token);*/
            });
            return deferred.promise;
        };

        authSer.getUserToken = function() {
            return $cookies.get('SEUserToken');
        };

        authSer.isAuth = function() {
            return !!this.getUserToken();
        };

        return authSer;
    }])
    .controller('eschoolCotroller', ['$scope',
        '$location',
        '$http',
        'AppConfig',
        'AuthService',
        function($scope, $location, $http, AppConfig, AuthService) {
            $scope.isLogin = AuthService.isAuth();
            $scope.token = AuthService.getUserToken();
            
            $scope.cartSum = 0;
            $scope.loading = true;
            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?token=' + $scope.token).then(function(res) {
                console.log(res);
                $scope.loading = false;
                var carts_goods = res.data.Data != null ? res.data.Data : null;
                if (carts_goods) {
                    for (var i = 0; i < carts_goods.length; i++) {
                        $scope.cartSum += carts_goods[i].cart_num;
                    }
                }
            });

            $scope.login = function() {
                AuthService.login('1234567890').then(function(data){
                    $scope.token = data;
                    $scope.isLogin = true;
                    $location.path('/category/');
                });
            };

            $scope.$on('cartsumEvent', function(event, data) {
                console.log(data);
                $scope.cartSum = data;
            });
            $scope.$on('tokenEvent', function(event, data) {
                $scope.token = data;
            });

        }
    ]);
