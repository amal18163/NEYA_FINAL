/*
FILENAME: animations.js
AUTHOR: Amal Tidjani
DATE: 7/15/2016
*/

function animateLinks() {
  var img_url = "../images/bullet.png";

  $("#learn_more a").hover(
      function() {
          var id_a = "#" + $(this).attr("id") + "a";
          var id_b = "#" + $(this).attr("id") + "b";
          $(id_a + ", " + id_b).stop().css({opacity: "0.0", visibility: "visible"})
                               .animate({opacity: "1.0"});

      },

      function() {
          var id_a = "#" + $(this).attr("id") + "a";
          var id_b = "#" + $(this).attr("id") + "b";
          $(id_a + ", " + id_b).stop().css({opacity: "1.0", visibility: "visible"})
                               .animate({opacity: "0.0"});
      });
}

animateLinks();
