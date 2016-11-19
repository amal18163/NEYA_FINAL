d3.csv("data/programs.csv", function(data) {

function bubbleChart() {
 // Constants for sizing
 var width = 800;
 var height = 500;
 var nodes = [];
 var finalNodes = [];
 var radius = 30;
 var colors = {
     "Sports/Recreation": "green",
     "Adventure Programs": "lightblue",
     "Youth Development": "gold",
     "Education": "pink"
 };


 // Locations to move bubbles towards, depending
 // on which view mode is selected.
 var center = { x: width / 2, y: height / 2.5 };

 // var genderCenters = {
 //   "Female": { x: width / 3, y: height / 2 },
 //   "Male": { x: width / 2, y: height / 2 },
 // };

 var categCenters = {
   "Sports/Recreation": { x: width / 3, y: height / 3.1 },
   "Adventure Programs": { x: 600, y: height / 3.1 },
   "Youth Development": { x: width / 3, y: height / 1.4 },
   "Education": { x: 620, y: height / 1.4 },
 };

 var categTitle = {
   "Sports/Recreation": { x: 220, y: 20},
   "Adventure Programs": { x: 650, y: 20},
   "Youth Development": { x: 220, y: 300},
   "Education": { x: 650, y: 300}
 };

 // Used when setting up force and
 // moving around nodes
 var damper = 0.102;

 // These will be set in create_nodes and create_vis
 var svg = null;
 var bubbles = null;
 var nodes = [];

 // Charge function that is called for each node.
 // Charge is proportional to the diameter of the
 // circle (which is stored in the radius attribute
 // of the circle's associated data.
 // This is done to allow for accurate collision
 // detection with nodes of different sizes.
 // Charge is negative because we want nodes to repel.
 // Dividing by 8 scales down the charge to be
 // appropriate for the visualization dimensions.
 function charge() {
   return -Math.pow(radius, 2.0) / 8;
 }

 // Here we create a force layout and
 // configure it to use the charge function
 // from above. This also sets some contants
 // to specify how the force layout should behave.
 // More configuration is done below.
 var force = d3.layout.force()
   .size([width, height])
   .charge(charge)
   .gravity(-0.01)
   .friction(0.9);


  /*
  * This function returns the new node array, with a node in that
  * array for each element in the rawData input.
  */
 function createNodes() {
   // Use map() to convert raw data into node data.
   // Checkout http://learnjsdata.com/ for more on
   // working with data.

   data.forEach(function(d){
     var bubble_node = {
       activity: d.activity,
       category: d.category,
       week: d.week,
       day: d.day,
       season: d.season,
       description: d.description,
       x: Math.random() * 900,
       y: Math.random() * 800
     };

     nodes.push(bubble_node);
   });

   nodes.sort(function (a, b) { return b.value - a.value; });
   return nodes;
 }

 /*
  * Main entry point to the bubble chart. This function is returned
  * by the parent closure. It prepares the rawData for visualization
  * and adds an svg element to the provided selector and starts the
  * visualization creation process.
  *
  * selector is expected to be a DOM element or CSS selector that
  * points to the parent element of the bubble chart. Inside this
  * element, the code will add the SVG continer for the visualization.
  *
  * rawData is expected to be an array of data objects as provided by
  * a d3 loading function like d3.csv.
  */

 var images = {
   "Basketball": "url(#bball)",
   "Soccer": "url(#soccer)",
   "Badminton": "url(#badminton)",
   "Bowling": "url(#bowling)",
   "Roller Skating": "url(#skating)",
   "Rock Climbing": "url(#climbing)",
   "White Water Rafting": "url(#rafting)",
   "Math Club": "url(#math)",
   "Learn JavaScript": "url(#javascript)",
   "Web-Design": "url(#web_design)",
   "Poetry Club": "url(#poetry)",
   "Book Club": "url(#book)",
   "Bird Watching": "url(#bird)",
   "Camping": "url(#camp)",
   "Zoo Club": "url(#zoo)",
   "Hiking": "url(#hiking)",
   "Meals on Wheels": "url(#meals)",
   "Community Service": "url(#service)",
   "Quranic Studies": "url(#quran)"
 }




 var chart = function chart(selector) {
   // Use the max total_amount in the data as the max in the scale's domain
   // note we have to ensure the total_amount is a number by converting it
   // with `+`.

   finalNodes = createNodes();
   // Set the force's nodes to our newly created nodes array.
   force.nodes(finalNodes);

   // Create a SVG element inside the provided selector
   // with desired size.
   svg = d3.select(selector)
     .append('svg')
     .attr('width', width)
     .attr('height', height);

     function createBubbleImage(id, url) {
       svg.append("defs")
          .append("pattern")
          .attr("id", id)
          .attr("width", 1)
          .attr("height", 1)
          .attr("solid", "userSpaceOnUse")
          .append("image")
          .attr("xlink:href", url)
          .attr("width", 70)
          .attr("height", 70)
          .attr("x", -5)
          .attr("y", -5)
     }

     createBubbleImage("bball", "images/bball.png");
     createBubbleImage("soccer", "images/soccer.png");
     createBubbleImage("badminton", "images/badminton.png");
     createBubbleImage("bowling", "images/bowling.png");
     createBubbleImage("skating", "images/skating.png");
     createBubbleImage("climbing", "images/climbing.png");
     createBubbleImage("rafting", "images/rafting.png");
     createBubbleImage("math", "images/math.png");
     createBubbleImage("javascript", "images/javascript.png");
     createBubbleImage("web_design", "images/web_design.png");
     createBubbleImage("poetry", "images/poetry.png");
     createBubbleImage("book", "images/book.png");
     createBubbleImage("bird", "images/bird_watching.png");
     createBubbleImage("camp", "images/camp.png");
     createBubbleImage("zoo", "images/zoo.png");
     createBubbleImage("hiking", "images/hiking.png");
     createBubbleImage("meals", "images/meals.png");
     createBubbleImage("service", "images/service.png");
     createBubbleImage("quran", "images/quran.png");


   // Bind nodes data to what will become DOM elements to represent them.
   bubbles = svg.selectAll('.bubble')
     .data(nodes, function (d) { return d.activity; });

   // Create new circle elements each with class `bubble`.
   // There will be one circle.bubble for each object in the nodes array.
   // Initially, their radius (r attribute) will be 0.
   bubbles.enter().append('circle')
     .classed('bubble', true)
     .attr('r', 0)
     .attr('fill', function (d) { return images[d.activity]; })
     .attr('stroke', "lightblue")//function (d) { return colors[d.category]; })
     .attr('stroke-width', 4)
     .on('mouseover', highlightBubble)
     .on('mouseout', hideHighlight)
     .on('click', showDetail);

   // Fancy transition to make bubbles appear, ending with the
   // correct radius
   bubbles.transition()
     .duration(2000)
     .attr('r', radius);

   // Set initial layout
   splitBubbles();
 };

 /*
  * Sets visualization in "single group mode".
  * The year labels are hidden and the force layout
  * tick function is set to move all nodes to the
  * center of the visualization.
  */
 // function groupBubbles() {
 //   hideTitles();
 //
 //   force.on('tick', function (e) {
 //     bubbles.each(moveToCenter(e.alpha))
 //       .attr('cx', function (d) { return d.x; })
 //       .attr('cy', function (d) { return d.y; });
 //   });
 //   force.start();
 // }

 /*
  * Helper function for "single group mode".
  * Returns a function that takes the data for a
  * single node and adjusts the position values
  * of that node to move it toward the center of
  * the visualization.
  *
  * Positioning is adjusted by the force layout's
  * alpha parameter which gets smaller and smaller as
  * the force layout runs. This makes the impact of
  * this moving get reduced as each node gets closer to
  * its destination, and so allows other forces like the
  * node's charge force to also impact final location.
  */
 // function moveToCenter(alpha) {
 //   return function (d) {
 //     d.x = d.x + (center.x - d.x) * damper * alpha;
 //     d.y = d.y + (center.y - d.y) * damper * alpha;
 //   };
 // }

 /*
  * Sets visualization in "split by year mode".
  * The year labels are shown and the force layout
  * tick function is set to move nodes to the
  * yearCenter of their data's year.
  */
 function splitBubbles() {
   showTitles();

   force.on('tick', function (e) {
     bubbles.each(moveToCategories(e.alpha))
       .attr('cx', function (d) { return d.x; })
       .attr('cy', function (d) { return d.y; });
   });

   force.start();
 }

 function showAllBubbles() {
   force.on('tick', function (e) {
     bubbles.each(moveToCategories(e.alpha))
       .attr('cx', function (d) { return d.x; })
       .attr('cy', function (d) { return d.y; });
   });

   force.start();
 }


 function showSeasonBubbles() {
   var stroke_color;
   force.on('tick', function (e) {
     bubbles.each(moveToCategories(e.alpha))
       .attr('cx', function (d) { return d.x; })
       .attr('cy', function (d) { return d.y; });
    bubbles.each(moveSeasonAway(e.alpha))
       .attr('cx', function (d) { return d.x; })
       .attr('cy', function (d) { return d.y; });
      //  .attr('stroke', function(d) { if (d.x == 1000) return "lightblue" })
      //  .attr('class', 'bubble');
   });

   force.start();
 }

 function showWeekBubbles() {
   force.on('tick', function (e) {
     bubbles.each(moveToCategories(e.alpha))
       .attr('cx', function (d) { return d.x; })
       .attr('cy', function (d) { return d.y; });
    bubbles.each(moveWeekAway(e.alpha))
       .attr('cx', function (d) { return d.x; })
       .attr('cy', function (d) { return d.y; });
   });

   force.start();
 }

 /*
  * Helper function for "split by year mode".
  * Returns a function that takes the data for a
  * single node and adjusts the position values
  * of that node to move it the year center for that
  * node.
  *
  * Positioning is adjusted by the force layout's
  * alpha parameter which gets smaller and smaller as
  * the force layout runs. This makes the impact of
  * this moving get reduced as each node gets closer to
  * its destination, and so allows other forces like the
  * node's charge force to also impact final location.
  */


 function moveToCategories(alpha) {
   return function (d) {
     var target = categCenters[d.category];
     d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
     d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
   };
 }

 function moveSeasonAway(alpha) {
   return function (d) {
       var selected = (document.getElementById("season_drop_menu")
                               .options[season_drop_menu.selectedIndex].value).toLowerCase();

       var season = (d.season.toString()).toLowerCase();

       if (selected == "all") {
         if(season != selected) {
            d.x = 1000;
            unclickBubble(d, d3.select(this));
         }
       } else if (season.search(selected) == -1 && season != "all") {
         console.log("NO MATCH!");
         d.x = 1000;
         unclickBubble(d, d3.select(this));
       };
   };
 }

 function moveWeekAway(alpha) {
   return function (d) {
       var selected = (document.getElementById("week_drop_menu")
                               .options[week_drop_menu.selectedIndex].value).toLowerCase();

       if (selected == "weekdays only")
          selected = "weekdays"

       if (selected == "weekends only")
          selected = "weekends"

       var week = (d.week.toString()).toLowerCase();

       if (week.search(selected) == -1) {
         d.x = 1000;
         unclickBubble(d, d3.select(this));
       };
   };
 }


 /*
  * Hides Year title displays.
  */
 function hideTitles() {
   svg.selectAll('.category').remove();
 }

 /*
  * Shows Year title displays.
  */
 function showTitles() {
   // Another way to do this would be to create
   // the year texts once and then just hide them.
   var categData = d3.keys(categTitle);
   var categories = svg.selectAll('.category')
     .data(categData);

   categories.enter().append('text')
     .attr('class', 'category')
     .attr('x', function (d) {
         var target = categTitle[d];
         return target.x; })
     .attr('y', function (d) {
         var target = categTitle[d];
         return target.y})
     .attr('fill', 'white')
     .attr('text-anchor', 'middle')
     .text(function (d) { return d; });
 }


 /*
  * Function called on mouseover to display the
  * details of a bubble in the tooltip.
  */

 function highlightBubble(d) {
   if (d3.select(this).classed("clicked") == false)
       d3.select(this).attr('cursor', 'pointer')
                      .attr('stroke-width', '12');

 //  var content = '<span class="name">Name: </span><span class="value">' +
 //                d.name +
 //                '</span><br/>' +
 //                '<span class="name">Position: </span><span class="value">' +
 //                addCommas(d.position) +
 //                '</span><br/>' +
 //                '<span class="name">Age: </span><span class="value">' +
 //                d.age +
 //                '</span>';
 // tooltip.showTooltip(content, d3.event);
 }

 function hideHighlight(d) {
   if (d3.select(this).classed("clicked") == false)
      d3.select(this).attr('stroke-width', '4');

   // tooltip.hideTooltip();
 }


 function updateProgramsBar(d) {
   document.getElementById("title_placeholder").style.display = "none";
   document.getElementById("activity_title").style.display = "block";
   document.getElementById("instructions").style.display = "none";
   document.getElementById("activity_basic").style.display = "block";
   document.getElementById("activity_descrip").style.display = "block";
   document.getElementById("activity_title").innerHTML = d.activity;
   document.getElementById("day").innerHTML = format(d.day);
   document.getElementById("season_offered").innerHTML = format(d.season);
   document.getElementById("category").innerHTML = d.category;
   document.getElementById("description").innerHTML = d.description;
 }

 function showDetail(d) {
   bubbles.each(function(d) {
     d3.select(this).attr("stroke", "lightblue")
                    .attr("stroke-width", 4)
                    .classed("clicked", false)
   });

   updateProgramsBar(d);
   d3.select(this).classed("clicked", true)
                  .attr("stroke", "orange")
                  .attr("stroke-width", "12")
                  .attr("cursor", "default");
 }

function hideDetail(d) {
  document.getElementById("title_placeholder").style.display = "block";
  document.getElementById("activity_title").style.display = "none";
  document.getElementById("instructions").style.display = "block";
  document.getElementById("activity_basic").style.display = "none";
  document.getElementById("activity_descrip").style.display = "none";
}

function unclickBubble(d, bubble) {
  if (bubble.classed('clicked') == true) {
      bubble.attr('stroke', 'lightblue')
                     .attr('stroke-width', 4)
                     .classed('clicked', false);
      hideDetail(d);
  }
}

 function format(str) {
   if ((str).toLowerCase() == "all")
      str = "All-Year-Round";

   if (str.search(";") != -1) {
      return str.replace(/;/g, ", ");
   }
   return str;
 }

 // function filterSeason() {
 //
 //    var selected = document.getElementById("season_drop_menu")
 //                           .options[season_drop_menu.selectedIndex].value;
 //
 //    bubbles.each(function(d) {
 //       var season = d.season.toString();
 //
 //       if (season.search(selected) != -1) {
 //           console.log("YAY MATCH!");
 //           moveToCategories(e.alpha);
 //           //d3.select(this).style("visibility", "visible");
 //
 //         }
 //        //  else {
 //        //    moveToCenter(e.alpha);
 //        //   //  console.log("No Match");
 //        //   //  d3.select(this).style("visibility", "hidden");
 //        //  }
 //   });
 //
 //   //splitBubbles();
 // }

 // function filterWeek() {
 //
 //    var selected = document.getElementById("week_drop_menu")
 //                           .options[week_drop_menu.selectedIndex].value;
 //
 //    bubbles.each(function(d) {
 //       var week = d.week.toString();
 //
 //       if (week.search(selected) != -1) {
 //           moveToCategories();
 //           //d3.select(this).style("visibility", "visible");
 //
 //         }
 //        //  else {
 //        //    moveToCenter();
 //        //   //  console.log("No Match");
 //        //   //  d3.select(this).style("visibility", "hidden");
 //        //  }
 //   });
 //
 //   //splitBubbles();
 // }

 function clickFilterButton(menu_id) {
   console.log("in clickFilterButton");
   showAllBubbles();
   d3.selectAll(".select").style("visibility", "hidden");
   d3.selectAll(".select").each(function() { this.value = "choose";});
  //  d3.selectAll(".button").each(function() { d3.select(this).style("disabled", "false");
  //                                            d3.select(this).style("cursor", "pointer");});
  //  d3.selectAll('.bubble').style('visibility', 'visible');
   d3.select(menu_id).style("visibility", "visible");
 }

   chart.toggleDisplay = function (displayName) {
     if (displayName === 'all') {
       console.log("all clicked");
       showAllBubbles();
       d3.selectAll(".select").style("visibility", "hidden");
       d3.selectAll(".select").each(function() { this.value = "choose";});
     } else if (displayName === 'season'){
       console.log("season clicked");
       clickFilterButton("#season_drop_menu");
     } else if (displayName === 'week'){
       console.log("week clicked");
       clickFilterButton("#week_drop_menu");
     }
   };

   document.getElementById("season_drop_menu").addEventListener("change", showSeasonBubbles);
   document.getElementById("week_drop_menu").addEventListener("change", showWeekBubbles);




  //  function setupButtons() {
  //
  //    d3.select("#impact_button").on('click', function() { filterButton("#impact_filter")});

  //  chart.toggleDisplay = function (displayName) {
  //    if (displayName === 'season') {
  //      document.getElementById("season_drop_menu").visibility=
  //    } else if (displayName === 'admin'){
  //      showAdminBubbles();
  //    } else {
  //      groupBubbles();
  //    }
  //  };



 // <p class = "bio_text" id = "basic_info">
 //   <span id = "name"></span>
 //   <span id = "age"></span>
 //   <span id = "position"></span>
 // <p class = "bio_text" id = "bio_info">
 //   <span id = "bio"></span>
 // </p>

 //   console.log("showDetail invoked!");
 //   d3.select(this).attr('stroke', 'black');
 //
 //   var content = '<span class="name">Name: </span><span class="value">' +
 //                 d.name +
 //                 '</span><br/>' +
 //                 '<span class="name">Position: </span><span class="value">' +
 //                 addCommas(d.position) +
 //                 '</span><br/>' +
 //                 '<span class="name">Age: </span><span class="value">' +
 //                 d.age +
 //                 '</span>';
 //   tooltip.showTooltip(content, d3.event);
 // }

 /*
  * Hides tooltip
  */
 // function hideDetail(d) {
 //   // reset outline
 //   d3.select(this)
 //     .attr('stroke', d3.rgb(colors[d.category]));
 //
 //   tooltip.hideTooltip();
 // }

 /*
  * Externally accessible function (this is attached to the
  * returned chart function). Allows the visualization to toggle
  * between "single group" and "split by year" modes.
  *
  * displayName is expected to be a string and either 'year' or 'all'.
  */



 // return the chart function from closure.
 return chart;
}

/*
* Below is the initialization code as well as some helper functions
* to create a new bubble chart instance, load the data, and display it.
*/

var myBubbleChart = bubbleChart();

/*
* Function called once data is loaded from CSV.
* Calls bubble chart function to display inside #vis div.
*/
function display(error, data) {
 myBubbleChart('#activity_chart');
}

/*
* Sets up the layout buttons to allow for toggling between view modes.
*/
function setupButtons() {
 d3.select('#act_toggle_bar')
   .selectAll('.filters')
   .on('click', function () {
     // Remove active class from all buttons
     d3.selectAll('.filters').classed('active', false);
     // Find the button just clicked
     var button = d3.select(this);

     // Set it as the active button
     button.classed('active', true);

     // Get the id of the button
     var buttonId = button.attr('id');

     // Toggle the bubble chart based on
     // the currently clicked button.
     myBubbleChart.toggleDisplay(buttonId);
   });
}

/*
* Helper function to convert a number into a string
* and add commas to it to improve presentation.
*/
// function addCommas(nStr) {
//  nStr += '';
//  var x = nStr.split('.');
//  var x1 = x[0];
//  var x2 = x.length > 1 ? '.' + x[1] : '';
//  var rgx = /(\d+)(\d{3})/;
//  while (rgx.test(x1)) {
//    x1 = x1.replace(rgx, '$1' + ',' + '$2');
//  }
//
//  return x1 + x2;
// }

// Load the data.
display();

// setup the buttons.
setupButtons();
});
