(function(angular) {
    angular.module('eschool.directives.goodsselected', [])
        .directive('goodsSelected', [function() {
            return {
                restrict: 'A',
                link: function($scope, iElm, iAttrs, controller) {
                    iElm.on('click', function() {
                        if (iElm.children().eq(3).hasClass('school_dom_hide')) {
                        	console.log(0);
                            iElm.children().eq(0).addClass('school_dom_hide');
                            iElm.children().eq(2).addClass('school_dom_hide');
                            iElm.children().eq(3).removeClass('school_dom_hide');
                        }
                    });
                }
            };
        }]);
})(angular);
