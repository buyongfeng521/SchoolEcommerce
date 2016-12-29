(function(angular) {
    'use strict';
    /*定义模块*/
    var module = angular.module('eschool_cart', ['ngRoute']);
    /*定义路由*/
    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/cart', {
            templateUrl: 'e_cart/view.html',
            controller: 'ECartController'
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

            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?user_id=' + user_id).then(function(res) {
                console.log(res);
                $scope.cartlist = res.data.Data;
                for(var i=0;i<$scope.cartlist.length;i++){
                    carts_sum += $scope.cartlist[i].cart_num;
                }
                //update carts_num
                $scope.$emit("cartsumEvent", carts_sum);
            });

            //function
            $scope.minus = function(current_num, user_id, goods_id) {
                //删除
                if (current_num == 1) {
                    Popup.confirm('确定删除商品？', function() {
                        deleteCart(user_id, goods_id);

                        //update carts_mum
                        carts_sum--;
                        $scope.$emit("cartsumEvent", carts_sum);
                    }, function() {
                        console.log('cancel');
                    });

                } else {
                    updateCartNum(user_id, goods_id, --current_num);
                    //update carts_mum
                    carts_sum--;
                    $scope.$emit("cartsumEvent", carts_sum);
                }
            };
            $scope.add = function(current_num, user_id, goods_id) {
                current_num++;
                //update carts_mum
                carts_sum++;
                $scope.$emit("cartsumEvent", carts_sum);

                updateCartNum(user_id, goods_id, current_num);
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

        }
    ]);
})(angular);
