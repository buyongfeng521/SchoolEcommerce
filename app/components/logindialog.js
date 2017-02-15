/*(function(angular) {
    angular.module('eschool.directives.logindialog', [])
        .directive('loginDialog', ['$location', function($location) {
            return {
                restrict: 'A',
                template: '<div ng-if="visible" ng-include="\'e_login/view.html\'">',
                link: function(scope) {
                    var showDialog = function() {
                        scope.visible = true;
                    };

                    scope.visible = true;
                    scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
                    scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
                }
            };
        }]);
})(angular);*/
