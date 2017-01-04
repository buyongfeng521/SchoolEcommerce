'use strict'

angular.module('eschool', [
        'ngRoute',
        'angular-popups',
        'eschool_category',
        'eschool_cart',
        'eschool_mine',
        'eschool.directives.autofocuscategory',
        'eschool.directives.autofocusmenu',
        'eschool.directives.goodsselected'
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
    /*.factory('CommomData', function() {
        return {
            CartGoodsSum: 0
        };
    })*/
    .controller('eschoolCotroller', ['$scope', '$http', 'AppConfig', function($scope, $http, AppConfig) {
        var user_id = "123";
        $scope.cartSum = 0;
        $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?user_id=' + user_id).then(function(res) {
            var carts_goods = res.data.Data;
            for (var i = 0; i < carts_goods.length; i++) {
                $scope.cartSum += carts_goods[i].cart_num;
            }
        });
        $scope.$on("cartsumEvent", function(event, data) {
            console.log(data);
            $scope.cartSum = data;
        });
    }]);
