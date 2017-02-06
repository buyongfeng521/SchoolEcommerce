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
        }).when('/mine/main/order/detail/:id', {
            //#/mine/main/order/orderdetail/ffaec0bb4cb84970b2780411f3e54cb2
            templateUrl: 'e_mine/orderdetail.html',
            controller: 'EMineOrderDetailController'
        }).when('/mine/main/address', {
            templateUrl: 'e_mine/address.html',
            controller: 'EMineAddressController'
        }).when('/mine/main/address/detail/:id', {
            templateUrl: 'e_mine/addressdetail.html',
            controller: 'EMineAddressDetailController'
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
    module.controller('EMineOrderController', ['$scope',
        '$location',
        '$http',
        '$route',
        '$routeParams',
        'AppConfig',
        'Popup',
        'AuthService',
        function($scope, $location, $http, $route, $routeParams, AppConfig, Popup, AuthService) {
            $scope.token = AuthService.getUserToken();
            $scope.orderType = 'All';
            $scope.orderListAll = [];
            $scope.orderListPrePay = [];
            $scope.orderListPreFinished = [];

            $http.get(AppConfig.eschoolAPI + 'Shopping/OrderList?token=' + $scope.token).then(function(res) {
                $scope.orderListAll = res.data.Data;
            });

            $http.get(AppConfig.eschoolAPI + 'Shopping/OrderListPrePay?token=' + $scope.token).then(function(res) {
                $scope.orderListPrePay = res.data.Data;
            });

            $http.get(AppConfig.eschoolAPI + 'Shopping/OrderListPreFinish?token=' + $scope.token).then(function(res) {
                $scope.orderListPreFinished = res.data.Data;
            });

            var initData = function() {
                $http.get(AppConfig.eschoolAPI + 'Shopping/OrderList?token=' + $scope.token).then(function(res) {
                    $scope.orderListAll = res.data.Data;
                });

                $http.get(AppConfig.eschoolAPI + 'Shopping/OrderListPrePay?token=' + $scope.token).then(function(res) {
                    $scope.orderListPrePay = res.data.Data;
                });

                $http.get(AppConfig.eschoolAPI + 'Shopping/OrderListPreFinish?token=' + $scope.token).then(function(res) {
                    $scope.orderListPreFinished = res.data.Data;
                });
            };


            $scope.changeTab = function(type) {
                $scope.orderType = type;
            };


            $scope.cancelOrder = function(order_id) {
                Popup.confirm('确定取消订单？', function() {
                    $http.post(AppConfig.eschoolAPI + 'Shopping/CancelOrder', { 'token': $scope.token, 'order_bas_id': order_id }).then(function(res) {
                        //$location.path('');
                        //http://localhost:8080/app/index.html#/mine/main/order
                        //$location.path('/mine/main/order');
                        initData();
                    });
                }, function() {

                });
            };

            $scope.confirmReceiving = function(order_id) {
                Popup.confirm('确认收货？', function() {
                    $http.post(AppConfig.eschoolAPI + 'Shopping/FinishOrder', { 'token': $scope.token, 'order_bas_id': order_id }).then(function(res) {
                        //$location.path('');
                        //http://localhost:8080/app/index.html#/mine/main/order
                        //$location.path('/mine/main/order');
                        initData();
                    });
                });
            };



        }
    ]);

    module.controller('EMineOrderDetailController', ['$scope',
        '$location',
        '$http',
        '$route',
        '$routeParams',
        'AppConfig',
        'Popup',
        'AuthService',
        function($scope, $location, $http, $route, $routeParams, AppConfig, Popup, AuthService) {
            $scope.token = AuthService.getUserToken();
            $scope.id = $routeParams.id;
            $scope.orderdetail = [];
            $scope.addressdesc = '';
            $scope.consignee = '111';
            $scope.goodsamount = 0;

            $http.get(AppConfig.eschoolAPI + 'Shopping/OrderDetail?token=' + $scope.token + '&order_bas_id=' + $scope.id).then(function(res) {
                $scope.orderdetail = res.data.Data;
                console.log($scope.orderdetail);
                if ($scope.orderdetail.length > 0) {
                    $scope.addressdesc = $scope.orderdetail[0].order_bas.address;
                    $scope.consignee = $scope.orderdetail[0].order_bas.consignee;
                    $scope.goodsamount = $scope.orderdetail[0].order_bas.goods_amount;
                }
            });

            $scope.cancelOrder = function(order_id) {
                Popup.confirm('确定取消订单？', function() {
                    $http.post(AppConfig.eschoolAPI + 'Shopping/CancelOrder', { 'token': $scope.token, 'order_bas_id': order_id }).then(function(res) {
                        //$location.path('');
                        //http://localhost:8080/app/index.html#/mine/main/order
                        $location.path('/mine/main/order');
                    });
                }, function() {

                });
            };

            $scope.confirmReceiving = function(order_id) {
                Popup.confirm('确认收货？', function() {
                    $http.post(AppConfig.eschoolAPI + 'Shopping/FinishOrder', { 'token': $scope.token, 'order_bas_id': order_id }).then(function(res) {
                        //$location.path('');
                        //http://localhost:8080/app/index.html#/mine/main/order
                        $location.path('/mine/main/order');
                    });
                });
            };



        }
    ]);

    module.controller('EMineAddressController', ['$scope',
        '$location',
        '$http',
        '$route',
        '$routeParams',
        'AppConfig',
        'Popup',
        'AuthService',
        function($scope, $location, $http, $route, $routeParams, AppConfig, Popup, AuthService) {
            $scope.userAddressList = [];
            $scope.token = AuthService.getUserToken();

            $scope.delAddress = function(ua_id) {
                Popup.confirm('确定删除此地址？', function() {
                    $http.post(AppConfig.eschoolAPI + 'Mine/UserAddressDelete', { 'ua_id': ua_id }).then(function(res) {
                        console.log(res);
                        initData();
                    });
                }, function() {
                    console.log('cancel');
                });
            };

            var initData = function() {
                $http.get(AppConfig.eschoolAPI + 'Mine/UserAddressGet?token=' + $scope.token).then(function(res) {
                    $scope.userAddressList = res.data.Data;
                });
            };

            initData();

        }
    ]);
    module.controller('EMineAddressDetailController', ['$scope',
        '$location',
        '$http',
        '$route',
        '$routeParams',
        'AppConfig',
        'AuthService',
        function($scope, $location, $http, $route, $routeParams, AppConfig, AuthService) {
            $scope.consignee = "";
            $scope.phone = "";

            $scope.id = $routeParams.id;
            $scope.status = 0;
            $scope.schoolList = [];
            $scope.areaList = [];
            $scope.buildingList = [];
            $scope.layerList = [];
            $scope.roomList = [];
            $scope.buildingId = "";
            $scope.roomId = "";

            $scope.token = AuthService.getUserToken();
            $scope.schoolName = "";
            $scope.areaName = "";
            $scope.buildingName = "";
            $scope.roomNum = "";
            $scope.addressDesc = "选择地址";
            $scope.is_default = false;

            $scope.change_school = function() {
                $http.get(AppConfig.eschoolAPI + 'Mine/SchoolListGet').then(function(res) {
                    $scope.schoolList = res.data.Data;
                });

                $scope.status = 1;
            };

            $scope.change_area = function(school_id, school_name) {
                $http.get(AppConfig.eschoolAPI + 'Mine/AreaListGet?school_id=' + school_id).then(function(res) {
                    $scope.areaList = res.data.Data;
                });

                $scope.schoolName = school_name;
                $scope.status = 2;
            };

            $scope.change_building = function(area_id, area_name) {
                $http.get(AppConfig.eschoolAPI + 'Mine/BuildingListGet?area_id=' + area_id).then(function(res) {
                    $scope.buildingList = res.data.Data;
                });
                $scope.areaName = area_name;
                $scope.status = 3;
            };

            $scope.change_layer = function(building_id, building_name) {
                $http.get(AppConfig.eschoolAPI + 'Mine/LayerListGet?building_id=' + building_id).then(function(res) {
                    $scope.layerList = res.data.Data;
                });
                $scope.buildingId = building_id;
                $scope.buildingName = building_name;
                $scope.status = 4;
            };

            $scope.change_room = function(layer) {
                $http.get(AppConfig.eschoolAPI + 'Mine/RoomListGet?building_id=' + $scope.buildingId + '&layer=' + layer).then(function(res) {
                    $scope.roomList = res.data.Data;
                });

                $scope.status = 5;
            };

            $scope.change_finish = function(room_id, room_num) {
                $scope.roomId = room_id;
                $scope.roomNum = room_num;
                $scope.status = 0;
                $scope.addressDesc = $scope.schoolName + $scope.areaName + $scope.buildingName + $scope.roomNum;
            };

            $scope.save_address = function() {
                // add/edit
                $http.post(AppConfig.eschoolAPI + 'Mine/UserAddressSave', {
                    'ua_id': $scope.id,
                    'token': $scope.token,
                    'consignee': $scope.consignee,
                    'phone': $scope.phone,
                    'room_id': $scope.roomId,
                    'is_default': $scope.is_default
                }).then(function(res) {
                    console.log(res);
                    $location.path('/mine/main/address');
                }, function(res) {
                    console.log(res);
                });


                console.log($scope.id);
                console.log($scope.roomId);
                console.log($scope.consignee);
                console.log($scope.phone);
                console.log($scope.is_default);

            };


            var initData = function(ua_id) {
                $http.get(AppConfig.eschoolAPI + 'Mine/UserAddressEntityGet?ua_id=' + ua_id).then(function(res) {
                    var userAddressModel = res.data.Data;
                    $scope.consignee = userAddressModel.consignee;
                    $scope.phone = userAddressModel.phone - 0;

                    $scope.schoolName = userAddressModel.room.school_name;
                    $scope.areaName = userAddressModel.room.area_name;
                    $scope.buildingName = userAddressModel.room.building_name;
                    $scope.roomNum = userAddressModel.room.room_num;
                    $scope.addressDesc = $scope.schoolName + $scope.areaName + $scope.buildingName + $scope.roomNum.toString();
                    $scope.is_default = userAddressModel.is_default;
                    $scope.roomId = userAddressModel.room.room_id;
                });
            };

            if ($scope.id != "0") {
                initData($scope.id);
            }

        }
    ]);
    module.controller('EMineContactController', ['$scope', function($scope) {

    }]);
    module.controller('EMineAboutController', ['$scope', function($scope) {

    }]);
})(angular);
