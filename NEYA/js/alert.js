
$("#tel").click(function() {
  $(".alert").css("display", "block");
});

// function showAlert() {
//     console.log("in showAlert");
//     $("#tel").css("display", "block");
// }
//
//
// $(function() {
//   $(".contact_icons img").click(showAlert);
// });

// function clickFunctionality() {
//   console.log("in click functionality")
//   $("#tel").on("click", showAlert);
// }
//
// clickFunctionality();

// $("#tel").on("click", function() {
//     console.log("hello");
//     $(".alert").show();
//     console.log("in showAlert");
//   });

/*
 Code borrowed from stackoverflow user prc322
 http://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it
*/

// $(document).mouseup(function (e)
// {
//     var container = $(".alert");
//
//     if (!container.is(e.target) // if the target of the click isn't the container...
//         && container.has(e.target).length === 0) // ... nor a descendant of the container
//     {
//         container.hide();
//     }
// });
