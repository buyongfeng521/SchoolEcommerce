(function(angular) {
    'use strict';
    /*定义模块*/
    var module = angular.module('eschool_category', ['ngRoute']);
    /*定义路由*/
    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/category/:categoryid', {
            templateUrl: 'e_category/view.html',
            controller: 'ECategoryController'
        });
    }]);
    /*定义控制器*/
    module.controller('ECategoryController', ['$scope',
        '$route',
        '$http',
        '$routeParams',
        'AppConfig',
        function($scope, $route, $http, $routeParams, AppConfig) {
            //params
            var category_id = $routeParams.categoryid;
            //model
            $scope.categorylist = [];
            $scope.goodslist = [];

            /*1.0 Category*/
            $http.get(AppConfig.eschoolAPI + 'Goods/CategoryListGet', { 'headers': { 'Accept': 'application/json' } }).then(function(res) {
                $scope.categorylist = res.data.Data;
                if (category_id == 'default') {
                    /*category_id = res.data.Data[0].category_id;
                    console.log(category_id);*/
                    $route.updateParams({ categoryid: res.data.Data[0].category_id });
                }
            }, function(res) {

            });
            /*2.0 goods*/
            if (category_id != 'default') {
                $http.get(AppConfig.eschoolAPI + 'Goods/GoodsListGet?category_id=' + category_id, { 'headers': { 'Accept': 'application/json' } }).then(function(res) {
                    console.log(res.data);
                    $scope.goodslist = res.data.Data;
                }, function(res) {

                });
            }

            //fucntion
            $scope.goCategory = function(cat_id) {
                console.log(cat_id);
                $route.updateParams({ categoryid: cat_id });
            };
        }
    ]);

})(angular);
