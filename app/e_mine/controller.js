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
    module.controller('EMineAddressController', ['$scope', function($scope) {

    }]);
    module.controller('EMineAddressDetailController', ['$scope',
        '$http',
        '$route',
        '$routeParams',
        'AppConfig',
        function($scope, $http, $route, $routeParams, AppConfig) {
            $scope.id = $routeParams.id;
            $scope.status = 0;
            $scope.schoolList = [];
            $scope.areaList = [];
            $scope.buildingList = [];
            $scope.layerList = [];
            $scope.roomList = [];
            $scope.buildingId = "";
            $scope.roomId = "";

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
                //1.0 add
                if (!$scope.id) {
                    $http.post(AppConfig.eschoolAPI + 'Mine/UserAddressSave', {
                        'user_id': user_id,
                        'goods_id': goods_id
                    }).then(function(res) {
                        console.log(res);
                    });
                }
                //2.0 edit
                else {

                }


                console.log($scope.id);
                console.log($scope.roomId);
                console.log($scope.consignee);
                console.log($scope.phone);
                console.log($scope.is_default);

            };

        }
    ]);
    module.controller('EMineContactController', ['$scope', function($scope) {

    }]);
    module.controller('EMineAboutController', ['$scope', function($scope) {

    }]);
})(angular);
