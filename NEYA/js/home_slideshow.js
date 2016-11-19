
var slides = ["slide_1.png", "slide_2.png", "slide_3.png",
              "slide_4.png", "slide_5.png", "slide_6.png"];

var c1_index = 0;
var c2_index = 1;
var c3_index = 2;

function displaySlide() {
  var c1_url = "url('images/" + slides[c1_index] + "')";
  var c2_url = "url('images/" + slides[c2_index] + "')";
  var c3_url = "url('images/" + slides[c3_index] + "')";
  $("#img1").css("background-image", c1_url);
  $(".large").css("background-image", c2_url);
  $("#img3").css("background-image", c3_url);
}

function advanceCarousel() {
  c1_index++;
  c2_index++;
  c3_index++;

  if (c1_index >= slides.length)
    c1_index = 0;

  if (c2_index >= slides.length)
    c2_index = 0;

  if (c3_index >= slides.length)
    c3_index = 0;

  displaySlide();
}

displaySlide(); //Display Initial Slides on page load;
setInterval(advanceCarousel, 5000);
