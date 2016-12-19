var category_event = function(){
	/*left*/
	$("#wx_category .category_left ul li").on("click",function(){
		if($(this).hasClass("selected") == false){
			$(this).addClass("selected").siblings().removeClass("selected");
		}
	});
	/*right*/
	$("#wx_category .category_right ul li ").on("click",function(){
		var $cat_r_check = $(this).children(".cat_r_check");
		if($cat_r_check.attr("checked") == "checked"){
			$cat_r_check.removeAttr("checked");
		}
		else{
			$cat_r_check.attr("checked","checked");
		}
	});
};