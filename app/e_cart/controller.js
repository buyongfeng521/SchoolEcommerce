(function(angular) {
    'use strict';
    /*定义模块*/
    var module = angular.module('eschool_cart', ['ngRoute']);
    /*定义路由*/
    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/cart', {
                templateUrl: 'e_cart/view.html',
                controller: 'ECartController'
            })
            .when('/cart/submitorder', {
                templateUrl: 'e_cart/submitorder.html',
                controller: 'ECartSubmitOrderController'
            })
            .when('/cart/payprocess', {
                templateUrl: 'e_cart/payprocess.html',
                controller: 'ECartPayProcessController'
            });
    }]);
    /*定义控制器*/
    module.controller('ECartController', ['$scope',
        '$route',
        '$http',
        'AppConfig',
        'Popup',
        function($scope, $route, $http, AppConfig, Popup) {
            var user_id = "123";
            var carts_sum = 0;

            $scope.cartlist = [];
            $scope.itemnum = [];
            $scope.goodsamount = 0;

            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?user_id=' + user_id).then(function(res) {
                $scope.cartlist = res.data.Data;
                var arr = [];
                var goods_amount = 0;
                for (var i = 0; i < $scope.cartlist.length; i++) {
                    carts_sum += $scope.cartlist[i].cart_num;
                    goods_amount += ($scope.cartlist[i].cart_num * $scope.cartlist[i].goods.goods_price)

                    arr[i] = 0;
                    arr[i] = $scope.cartlist[i].cart_num;
                }
                $scope.itemnum = arr;
                $scope.goodsamount = goods_amount;
                //update carts_num
                $scope.$emit("cartsumEvent", carts_sum);
            });

            //function
            $scope.minus = function(index, user_id, goods_id, goods_price) {
                //删除
                if ($scope.itemnum[index] == 1) {
                    Popup.confirm('确定删除商品？', function() {
                        $scope.itemnum[index]--;
                        $scope.goodsamount -= goods_price;
                        deleteCart(user_id, goods_id);
                        //update carts_mum
                        carts_sum--;
                        $scope.$emit("cartsumEvent", carts_sum);
                    }, function() {
                        console.log('cancel');
                    });

                } else {
                    $scope.itemnum[index]--;
                    $scope.goodsamount -= goods_price;
                    updateCartNum(user_id, goods_id, $scope.itemnum[index]);
                    //update carts_mum
                    carts_sum--;
                    $scope.$emit("cartsumEvent", carts_sum);
                }
            };
            $scope.add = function(index, user_id, goods_id, goods_price) {
                $scope.itemnum[index]++;
                $scope.goodsamount += goods_price;
                //update carts_mum
                carts_sum++;
                $scope.$emit("cartsumEvent", carts_sum);

                updateCartNum(user_id, goods_id, $scope.itemnum[index]);
            };
            $scope.delete = function(index, user_id, goods_id, goods_price) {
                Popup.confirm('确定删除商品？', function() {
                    $scope.goodsamount -= ($scope.itemnum[index] * goods_price);
                    deleteCart(user_id, goods_id);
                    //update carts_mum
                    carts_sum = carts_sum - $scope.itemnum[index];
                    $scope.$emit("cartsumEvent", carts_sum);

                    $scope.itemnum[index] = 0;
                });
            };

            //commom function
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

        }
    ]);

    module.controller('ECartSubmitOrderController', ['$scope',
        '$route',
        '$http',
        'AppConfig',
        function($scope, $route, $http, AppConfig) {
            var user_id = "123";
            $scope.cartlist = [];
            $scope.goodsamount = 0;

            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?user_id=' + user_id).then(function(res) {
                $scope.cartlist = res.data.Data;
                var goods_amount = 0;
                for (var i = 0; i < $scope.cartlist.length; i++) {
                    goods_amount += ($scope.cartlist[i].cart_num * $scope.cartlist[i].goods.goods_price)
                }
                $scope.goodsamount = goods_amount;
            });
        }
    ]);

    module.controller('ECartPayProcessController', ['$scope', function($scope) {

    }]);
})(angular);
