var cart_envent = function() {
    /*change-*/
    $("#wx_cart .option .change_box .change_box_left").on("click", function() {
        var $input = $(this).next("input");
        var input_val = $input.val();
        if (input_val) {
            if (parseInt(input_val) < 1) {
                $input.val("1");
            } else if (parseInt(input_val) > 1) {
                $input.val(parseInt(input_val) - 1);
            }
        }

    });
    /*change+*/
    $("#wx_cart .option .change_box .change_box_right").on("click", function() {
        var $input = $(this).parent().children("input");
        var input_val = $input.val();
        if (input_val) {
            if (parseInt(input_val) > 9) {
                $input.val(10);
            } else {
                $input.val(parseInt(input_val) + 1);
            }
        }

    });
};
