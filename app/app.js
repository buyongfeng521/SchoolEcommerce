'use strict'

angular.module('eschool', [
        'ngRoute',
        'ngCookies',
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
        eschoolAPI: 'http://api.junyiweb.com/api/'
    })
    .config(['$routeProvider', 'PopupProvider', function($routeProvider, PopupProvider) {
        $routeProvider.otherwise({ redirectTo: '/category/default' });

        PopupProvider.title = '提示';
        PopupProvider.okValue = '确定';
        PopupProvider.cancelValue = '取消';
    }])
    .factory('AuthService', ['$cookies', '$http', '$q', 'AppConfig', function($cookies, $http, $q, AppConfig) {
        var authSer = {};

        authSer.login = function(code) {
            var token = '';
            var deferred = $q.defer();
            $http.get(AppConfig.eschoolAPI + 'Mine/WXOauth2?code=' + code).then(function(res) {
                token = res.data.Data;
                deferred.resolve(token)

                $cookies.put('SEUserToken', token, { expires: new Date(new Date().getTime() + 31536000000) });
                //$scope.$emit("tokenEvent", token);
            });
            return deferred.promise;
        };

        authSer.getUserToken = function() {
            return $cookies.get('SEUserToken');
        };

        authSer.isAuth = function() {
            return !!this.getUserToken();
        };

        return authSer;
    }])
    .factory('WePay', ['$http', 'AppConfig', function($http, AppConfig) {
        var payFactory = {};

        payFactory.pay = function wxPay(payData, backUrl) {
            var url = AppConfig.eschoolAPI + "Pay/BuildWePay";
            var data = payData;
            return $http.post(url, data).then(wxPayComplete).catch(wxPayFailed);

            function wxPayComplete(res) {
                console.log(res);
                res = res.data.Data;
                wx.chooseWXPay({
                    timestamp: res.timestamp, //支付签名时间戳， 注意微信jssdk中的所有使用timestamp字段均为小写。 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符 
                    nonceStr: res.noncestr, // 支付签名随机串，不长于 32 位 
                    package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***） 
                    signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5' 
                    paySign: res.paySign, // 支付签名 
                    success: function(resp) {
                        //if (resp) { window.location.hash = '/cart/payprocess'; }
                        if (resp) { window.location.hash = backUrl; }
                        //return "支付成功";
                    }
                });
            }


            function wxPayFailed(res) {
                //toastr.error("error:" + res);
                /*Popup.notice(res.data.msg, 3000, function() {
                    console.log('ok')
                });*/
                //alert(res);
                //return "支付失败";
            }
        }


        return payFactory;

    }])
    .controller('eschoolCotroller', ['$scope',
        '$location',
        '$http',
        'AppConfig',
        'AuthService',
        'Popup',
        function($scope, $location, $http, AppConfig, AuthService,Popup) {
            //休息中
            //中午11:40到13:20
            //晚上17:20到23:30
            //周末 8:00 - 23:30
            $scope.isRest = true;
            var sWeek = "日一二三四五六".charAt(new Date().getDay());
            if(sWeek != "日" && sWeek != "六"){//0和6也可
                var upStart = 11 * 3600 + 40 * 60;
                var upEnd = 13 * 3600 + 20 * 60;
                var downStart = 17 * 3600 + 20 * 60;
                var downEnd = 23 * 3600 + 30 * 60;
                var now = new Date().getHours() * 3600 + new Date().getMinutes() * 60;
                if(now > upStart && now < upEnd){
                    $scope.isRest = false;
                }
                if(now > downStart && now < downEnd){
                    $scope.isRest = false;
                }

            }
            else{
                var fullStart = 8 * 3600;
                var fullEnd = 23 * 3600 + 30 * 60;
                var now = new Date().getHours() * 3600 + new Date().getMinutes() * 60;
                if(now > fullStart && now < fullEnd){
                    $scope.isRest = false;
                }

            }

            var now = new Date().getHours() * 3600 + new Date().getMinutes() * 60;
            console.log("时间");
            console.log(now);




            


            $scope.isLogin = AuthService.isAuth();
            $scope.token = AuthService.getUserToken();

            $scope.cartSum = 0;
            $scope.loading = true;
            $http.get(AppConfig.eschoolAPI + 'Shopping/CartListGet?token=' + $scope.token).then(function(res) {
                console.log(res);
                $scope.loading = false;
                var carts_goods = res.data.Data != null ? res.data.Data : null;
                if (carts_goods) {
                    for (var i = 0; i < carts_goods.length; i++) {
                        $scope.cartSum += carts_goods[i].cart_num;
                    }
                }
            });

            /*$scope.login = function() {
                AuthService.login('1234567890').then(function(data) {
                    $scope.token = data;
                    $scope.isLogin = true;
                    $location.path('/category/');
                });
            };*/



            $scope.$on('cartsumEvent', function(event, data) {
                console.log(data);
                $scope.cartSum = data;
            });
            /*$scope.$on('tokenEvent', function(event, data) {
                //$scope.token = data;
                $scope.token = data.token;
                $scope.isLogin = data.isLogin;
            });*/

        }
    ])
    .run(runBlock);





/** @ngInject */
function runBlock($http, AppConfig) {
    var url = AppConfig.eschoolAPI + "Pay/GetWeJSConfig?url=" + window.location.href;
    console.log(url);
    $http.get(url)
        .then(function(res) {
            console.log(res);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.data.Data.appId, // 必填，公众号的唯一标识
                timestamp: res.data.Data.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.data.Data.nonceStr, // 必填，生成签名的随机串
                signature: res.data.Data.signature, // 必填，签名，见附录1
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

        })
        .catch(function(res) {
            //toastr.error(res.data.msg);
            //console.log(res.data.msg);
            return false;
        });
}
