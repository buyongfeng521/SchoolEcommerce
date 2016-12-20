'use strict'

angular.module('eschool', [
    'ngRoute',
    'eschool_category',
    'eschool.directives.autofocuscategory',
    'eschool.directives.autofocusmenu',
    'eschool.directives.goodsselected'
])
/*为模块定义一些常量*/
.constant('AppConfig', {
	pageSize:10,
	eschoolAPI:'http://42.96.206.46:8010/api/'
})
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/category/default' });
}]);