(function(angular){
	angular.module('eschool.directives.autofocuscategory',[])
	.directive('autofocusCategory',['$location',function($location){
		 return{
		 	restrict:'A',
		 	link:function($scope,iElm,iAttrs,controller){
				/*iElm.parent().children().removeClass('selected');
	 			iElm.addClass('selected');*/

		 		iElm.on('click',function(){
		 			iElm.parent().children().removeClass('selected');
		 			iElm.addClass('selected');
		 		});
		 	}
		 };
	}]);
})(angular);