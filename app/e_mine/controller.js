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
    module.controller('EMineOrderController', ['$scope', function($scope) {

    }]);
    module.controller('EMineAddressController', ['$scope',
        '$location',
        '$http',
        '$route',
        '$routeParams',
        'AppConfig',
        'Popup',
        function($scope, $location, $http, $route, $routeParams, AppConfig, Popup) {
            $scope.userAddressList = [];
            $scope.userId = "123";

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
                $http.get(AppConfig.eschoolAPI + 'Mine/UserAddressGet?user_id=' + $scope.userId).then(function(res) {
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
        function($scope, $location, $http, $route, $routeParams, AppConfig) {
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

            $scope.userId = "123";
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
                    'user_id': $scope.userId,
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
