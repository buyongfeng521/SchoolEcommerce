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
        'Popup',
        function($scope, $route, $http, $routeParams, AppConfig, Popup) {
            //params
            var category_id = $routeParams.categoryid;
            var user_id = "123";
            var carts_goods = [];
            var carts_sum = 0;
            //model
            $scope.categoryid = category_id;
            $scope.categorylist = [];
            $scope.goodslist = [];
            //model_goods
            $scope.itemnum = [];


            /*1.0 Category*/
            $http.get(AppConfig.eschoolAPI + 'Goods/CategoryListGet', { 'headers': { 'Accept': 'application/json' } }).then(function(res) {
                $scope.categorylist = res.data.Data;
                if (category_id == 'default') {
                    $route.updateParams({ categoryid: res.data.Data[0].category_id });
                }
            }, function(res) {

            });
            /*2.0 goods*/
            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?user_id=' + user_id).then(function(response) {
                //I cart
                carts_goods = response.data.Data;
                for (var i = 0; i < carts_goods.length; i++) {
                    carts_sum += carts_goods[i].cart_num;
                }
                //update carts_mum
                $scope.$emit("cartsumEvent", carts_sum);

                //II goods
                if (category_id != 'default') {
                    $http.get(AppConfig.eschoolAPI + 'Goods/GoodsListGet?category_id=' + category_id, { 'headers': { 'Accept': 'application/json' } }).then(function(res) {
                        $scope.goodslist = res.data.Data;
                        //arr
                        if ($scope.goodslist) {
                            var arr = [];
                            for (var i = 0; i < $scope.goodslist.length; i++) {
                                arr[i] = getCartGoodsNum($scope.goodslist[i].goods_id);
                            }
                            $scope.itemnum = arr;
                        }
                    }, function(res) {

                    });
                }
            });


            //fucntion
            $scope.goCategory = function(cat_id) {
                console.log(cat_id);
                $route.updateParams({ categoryid: cat_id });
            };
            $scope.buy = function($index, user_id, goods_id) {
                if ($scope.itemnum[$index] == 0) {
                    $scope.itemnum[$index]++;
                    //update carts_mum
                    carts_sum++;
                    $scope.$emit("cartsumEvent", carts_sum);

                    console.log($scope.itemnum[$index]);
                    updateCartNum(user_id, goods_id, $scope.itemnum[$index]);
                }
            };
            $scope.minus = function($index, user_id, goods_id) {
                var current_num = $scope.itemnum[$index];
                //删除
                if (current_num == 1) {
                    Popup.confirm('确定取消此商品？', function() {
                        $scope.itemnum[$index]--;
                        deleteCart(user_id, goods_id);

                        //update carts_mum
                        carts_sum--;
                        $scope.$emit("cartsumEvent", carts_sum);
                    }, function() {
                        console.log('cancel');
                    });

                } else {
                    $scope.itemnum[$index]--;
                    updateCartNum(user_id, goods_id, $scope.itemnum[$index]);
                    //update carts_mum
                    carts_sum--;
                    $scope.$emit("cartsumEvent", carts_sum);
                }
            };
            $scope.add = function($index, user_id, goods_id) {
                $scope.itemnum[$index]++;
                //update carts_mum
                carts_sum++;
                $scope.$emit("cartsumEvent", carts_sum);

                updateCartNum(user_id, goods_id, $scope.itemnum[$index]);
            };

            var updateCartNum = function(user_id, goods_id, num) {
                $http.post(AppConfig.eschoolAPI + 'Shopping/CartAdd', {
                    'user_id': user_id,
                    'goods_id': goods_id,
                    'cart_num': num
                }).then(function(res) {
                    console.log(res);
                });
            };

            var deleteCart = function(user_id, goods_id) {
                $http.post(AppConfig.eschoolAPI + 'Shopping/CartDelete', {
                    'user_id': user_id,
                    'goods_id': goods_id
                }).then(function(res) {
                    console.log(res);
                });
            };

            var getCartGoodsNum = function(goods_id) {
                for (var i = 0; i < carts_goods.length; i++) {
                    if (carts_goods[i].goods_id == goods_id) {
                        return carts_goods[i].cart_num - 0;
                    }
                }
                return 0;
            };

        }
    ]);

})(angular);
