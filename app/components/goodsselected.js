(function(angular){
	angular.module('eschool.directives.goodsselected',[])
	.directive('goodsSelected',[function(){
		 return{
		 	restrict:'A',
		 	link:function($scope,iElm,iAttrs,controller){
		 		iElm.on('click',function(){
		 			console.log(iElm);
		 			console.log(iAttrs);
		 			/*iElm.parent().children().removeClass('weui-bar__item_on');
		 			iElm.addClass('weui-bar__item_on');*/
		 		});
		 	}
		 };
	}]);
})(angular);