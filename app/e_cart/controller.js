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
        'AuthService',
        function($scope, $route, $http, AppConfig, Popup, AuthService) {
            var token = AuthService.getUserToken();
            $scope.token = token;
            var carts_sum = 0;

            $scope.cartlist = [];
            $scope.itemnum = [];
            $scope.goodsamount = 0;

            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?token=' + token).then(function(res) {
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
            $scope.minus = function(index, token, goods_id, goods_price) {
                //删除
                if ($scope.itemnum[index] == 1) {
                    Popup.confirm('确定删除商品？', function() {
                        $scope.itemnum[index]--;
                        $scope.goodsamount -= goods_price;
                        deleteCart(token, goods_id);
                        //update carts_mum
                        carts_sum--;
                        $scope.$emit("cartsumEvent", carts_sum);
                    }, function() {
                        console.log('cancel');
                    });

                } else {
                    $scope.itemnum[index]--;
                    $scope.goodsamount -= goods_price;
                    updateCartNum(token, goods_id, $scope.itemnum[index]);
                    //update carts_mum
                    carts_sum--;
                    $scope.$emit("cartsumEvent", carts_sum);
                }
            };
            $scope.add = function(index, token, goods_id, goods_price) {
                $scope.itemnum[index]++;
                $scope.goodsamount += goods_price;
                //update carts_mum
                carts_sum++;
                $scope.$emit("cartsumEvent", carts_sum);

                updateCartNum(token, goods_id, $scope.itemnum[index]);
            };
            $scope.delete = function(index, token, goods_id, goods_price) {
                Popup.confirm('确定删除商品？', function() {
                    $scope.goodsamount -= ($scope.itemnum[index] * goods_price);
                    deleteCart(token, goods_id);
                    //update carts_mum
                    carts_sum = carts_sum - $scope.itemnum[index];
                    $scope.$emit("cartsumEvent", carts_sum);

                    $scope.itemnum[index] = 0;
                });
            };

            //commom function
            var updateCartNum = function(token, goods_id, num) {
                $http.post(AppConfig.eschoolAPI + 'Shopping/CartAdd', {
                    'token': token,
                    'goods_id': goods_id,
                    'cart_num': num
                }).then(function(res) {
                    console.log(res);
                });
            };

            var deleteCart = function(token, goods_id) {
                $http.post(AppConfig.eschoolAPI + 'Shopping/CartDelete', {
                    'token': token,
                    'goods_id': goods_id
                }).then(function(res) {
                    console.log(res);
                });
            };

        }
    ]);

    module.controller('ECartSubmitOrderController', ['$scope',
        '$location',
        '$route',
        '$http',
        'AppConfig',
        'AuthService',
        'WePay',
        'Popup',
        function($scope, $location, $route, $http, AppConfig, AuthService, WePay, Popup) {
            var token = AuthService.getUserToken();
            $scope.token = token;
            $scope.addressdesc = '选择地址';
            $scope.consignee = '';
            $scope.phone = '';
            $scope.cartlist = [];
            $scope.goodsamount = 0;

            $scope.addresslist = [];
            $scope.ua_id = '';
            $scope.showaddresslist = false;

            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?token=' + token).then(function(res) {
                $scope.cartlist = res.data.Data;
                var goods_amount = 0;
                for (var i = 0; i < $scope.cartlist.length; i++) {
                    goods_amount += ($scope.cartlist[i].cart_num * $scope.cartlist[i].goods.goods_price)
                }
                $scope.goodsamount = goods_amount;
            });

            $http.get(AppConfig.eschoolAPI + 'Mine/UserAddressGet?token=' + $scope.token).then(function(res) {
                $scope.addresslist = res.data.Data;
                for (var i = 0; i < $scope.addresslist.length; i++) {
                    if ($scope.addresslist[i].is_default == true) {
                        $scope.ua_id = $scope.addresslist[i].ua_id;
                        $scope.addressdesc = $scope.addresslist[i].room.school_name + $scope.addresslist[i].room.area_name + $scope.addresslist[i].room.building_name + $scope.addresslist[i].room.room_num;
                        $scope.consignee = $scope.addresslist[i].consignee;
                        $scope.phone = $scope.addresslist[i].phone;
                        break;
                    }
                }
            });

            $scope.goAddressList = function() {
                $scope.showaddresslist = true;
            };

            $scope.changeAddress = function(ua_id, consignee, school_name, area_name, building_name, room_num, phone) {
                $scope.showaddresslist = false;
                $scope.ua_id = ua_id;
                $scope.addressdesc = school_name + area_name + building_name + room_num;
                $scope.consignee = consignee;
                $scope.phone = phone;
            };

            //#/cart/payprocess
            $scope.submitOrder = function() {

                console.log($scope.addressdesc);
                if ($scope.addressdesc == '选择地址') {
                    Popup.notice('请选择地址', 1000, function() {
                        console.log('ok')
                    });
                    return;
                }
                var url = AppConfig.eschoolAPI + "Shopping/CreateOrder";
                $http.post(url, {
                    'token': $scope.token,
                    'ua_id': $scope.ua_id,
                    'address': $scope.addressdesc,
                    'phone': $scope.phone,
                    'consignee': $scope.consignee
                }).then(function(res) {
                    //console.log(res);
                    if (res.data.status) {
                        $scope.$emit("cartsumEvent", 0);
                        //支付
                        var payParam = {"token":$scope.token,"order_id":res.data.Data.order_bas_id,"ip":"218.4.150.14"};
                        WePay.pay(payParam);

                        //$location.path('/cart/payprocess');
                    } else {
                        Popup.notice(res.data.msg, 3000, function() {
                            console.log('ok')
                        });
                    }
                }, function(res) {
                    console.log(res);
                });
            };

        }
    ]);

    module.controller('ECartPayProcessController', ['$scope', function($scope) {

    }]);
})(angular);
