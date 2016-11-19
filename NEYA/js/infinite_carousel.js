$(document).ready(function() {
    var slide_index = 1;
    var img_width = $(".carousel img").width();
    var left_step = img_width * -1;
    var initial_pos = (img_width / 2) * -1;
    // console.log("Image Width: " + img_width);
    // console.log("Left Margin: " + left_margin);
    $(".carousel").css("margin-left", initial_pos);


    $("#prev").click(function() {
        var target = (left_step * slide_index);
        console.log("target: " + target);
        console.log("index: " + slide_index);
        $(".carousel").animate({marginLeft: target}, 3000);
        //$(".carousel .slide:nth-child(2)").css({marginLeft: 0});
        //$(".carousel .slide:first").remove();
        $(".carousel").append($(".carousel .slide:first"));
        slide_index++;
        console.log("Animated");
    });

    $("")
})


// $(document).ready(function() {
//
// 	//rotation speed and timer
// 	var speed = 3000;
// 	var run = setInterval('rotate()', speed);
//
// 	//grab the width and calculate left value
// 	var item_width = $('#slides li').outerWidth();
// 	var left_value = item_width * (-1);
//
//     //move the last item before first item, just in case user click prev button
// 	$('#slides li:first').before($('#slides li:last'));
//
// 	//set the default item to the correct position
// 	$('#slides ul').css({'left' : left_value});
//
//     //if user clicked on prev button
// 	$('#prev').click(function() {
//
// 		//get the right position
// 		var left_indent = parseInt($('#slides ul').css('left')) + item_width;
//
// 		//slide the item
// 		$('#slides ul').animate({'left' : left_indent}, 200,function(){
//
//             //move the last item and put it as first item
// 			$('#slides li:first').before($('#slides li:last'));
//
// 			//set the default item to correct position
// 			$('#slides ul').css({'left' : left_value});
//
// 		});
//
// 		//cancel the link behavior
// 		return false;
//
// 	});
//
//
//     //if user clicked on next button
// 	$('#next').click(function() {
//
// 		//get the right position
// 		var left_indent = parseInt($('#slides ul').css('left')) - item_width;
//
// 		//slide the item
// 		$('#slides ul').animate({'left' : left_indent}, 50, function () {
//
//             //move the first item and put it as last item
// 			$('#slides li:last').after($('#slides li:first'));
//
// 			//set the default item to correct position
// 			$('#slides ul').css({'left' : left_value});
//
// 		});
//
// 		//cancel the link behavior
// 		return false;
//
// 	});
//
// 	//if mouse hover, pause the auto rotation, otherwise rotate it
// 	$('#slides').hover(
//
// 		function() {
// 			clearInterval(run);
// 		},
// 		function() {
// 			run = setInterval('rotate()', speed);
// 		}
// 	);
//
// });
//
// //a simple function to click next link
// //a timer will call this function, and the rotation will begin :)
// function rotate() {
// 	$('#next').click();
// }


function create_carousel() {
  /*Image ids are passed in and stored in an array-like object
    called arguments. Using arguments allows you to pass
    any number of urls into the function.*/

  var imageArray = Array.prototype.slice.call(arguments) //converts arguments into array

  var img_width = $("#" + imageArray[0]).width();
  var img_height = $("#" + imageArray[0]).height();
  var carousel_width = img_width * imageArray.length;

  $(".carousel").css("width", carousel_width)
                 .css("height", img_height);



  console.log("Width: " + img_width);
  console.log("Height: " + img_height);
  console.log("Carousel Width: " + carousel_width);
  console.log("Margin: " + $("#" + imageArray[0]).css("margin"));

}

create_carousel("1", "2", "3", "4", "5", "6");
