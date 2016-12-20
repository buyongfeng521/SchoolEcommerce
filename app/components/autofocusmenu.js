(function(angular){
	angular.module('eschool.directives.autofocusmenu',[])
	.directive('autofocusMenu',['$location',function($location){
		 return{
		 	restrict:'A',
		 	link:function($scope,iElm,iAttrs,controller){
		 		iElm.on('click',function(){
		 			iElm.parent().children().removeClass('weui-bar__item_on');
		 			iElm.addClass('weui-bar__item_on');
		 		});
		 	}
		 };
	}]);
})(angular);