/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

 d3.csv("data/leaders3.csv", function(data) {

function bubbleChart() {
  // Constants for sizing
  var width = 1000;
  var height = 1000;
  var nodes = [];
  var finalNodes = [];
  var radius = 50;
  var colors = {
      "Sports/Recreation": "green",
      "Adventure Programs": "lightblue",
      "Youth Development": "gold",
      "Education": "pink"
  };
  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2.5 };

  // var genderCenters = {
  //   "Female": { x: width / 3, y: height / 2 },
  //   "Male": { x: width / 2, y: height / 2 },
  // };

  var categCenters = {
    "Sports/Recreation": { x: width / 3, y: height / 3.2 },
    "Adventure Programs": { x: width / 1.6, y: height / 3.2 },
    "Youth Development": { x: width / 3, y: height / 1.7 },
    "Education": { x: width / 1.6, y: height / 1.7 },
  };

  var categTitle = {
    "Sports/Recreation": { x: 200, y: 100},
    "Adventure Programs": { x: 700, y: 100},
    "Youth Development": { x: 220, y: 500},
    "Education": { x: 630, y: 500}
  };

  // var ageCenters = {
  //   16: { x: width / 2, y: height / 2 },
  //   17: { x: width / 2, y: height / 2 },
  //   18: { x: width / 2, y: height / 2 },
  //   19: { x: width / 2, y: height / 2 },
  //   20: { x: width / 2, y: height / 2 },
  //   21: { x: width / 2, y: height / 2 },
  //   22: { x: width / 2, y: height / 2 },
  // };
  //
  //
  // // X locations of the year titles.
  // var yearsTitleX = {
  //   2008: 160,
  //   2009: width / 2,
  //   2010: width - 160
  // };

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


  // Nice looking colors - no reason to buck the trend
  // var fillColor = function(category) {
  //   return colors[category];
  // }
    // d3.scale.ordinal()
    // .domain(['low', 'medium', 'high'])
    // .range(['#d84b2a', '#beccae', '#7aa25c']);

  // Sizes bubbles based on their area instead of raw radius
  // var radiusScale = d3.scale.pow()
  //   .exponent(0.5)
  //   .range([2, 85]);

  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes() {
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.

    data1.forEach(function(d){
      var bubble_node = {
        name: d.name,
        gender: d.gender,
        age: d.age,
        category: d.category,
        position: d.position,
        bio: d.bio,
        url: d.url,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      console.log("d.bio: " + d.bio);
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

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.name; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('background', 'url(d.url) no-repeat')
      .attr('stroke', function (d) { return colors[d.category]; })
      .attr('stroke-width', 4)
      .on('mouseover', highlightBubble)
      .on('mouseout', hideHighlight)
      .on('click', showDetail);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', radius);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideTitles();

    force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });
    force.start();
  }

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
  function moveToCenter(alpha) {
    return function (d) {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    };
  }

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
  // function moveToAges(alpha) {
  //   return function (d) {
  //     var target = categCenters[d.category];
  //     d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
  //     d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
  //   };
  // }

  // function moveToGenders(alpha) {
  //   return function (d) {
  //     var target = categCenters[d.category];
  //     d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
  //     d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
  //   };
  // }

  function moveToCategories(alpha) {
    return function (d) {
      var target = categCenters[d.category];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }


  /*
   * Hides Year title displays.
   */
  function hideTitles() {
    console.log("svg.selectAll: " + svg.selectAll('.category'));
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

    console.log("Categories: " + categories.toString());
    categories.enter().append('text')
      .attr('class', 'category')
      .attr('x', function (d) {
          var target = categTitle[d];
          return target.x; })
      .attr('y', function (d) {
          var target = categTitle[d];
          return target.y})
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */

  function highlightBubble(d) {
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
    d3.select(this)
      .attr('stroke-width', '4');

    // tooltip.hideTooltip();
  }

  function showDetail(d) {
    // change outline to indicate hover state.
    document.getElementById("instructions").style.display = "none";
    document.getElementById("basic_info").style.display = "block";
    document.getElementById("bio_info").style.display = "block";
    document.getElementById("name").innerHTML = d.name;
    document.getElementById("age").innerHTML = d.age;
    document.getElementById("position").innerHTML = d.position;
    document.getElementById("bio").innerHTML = d.bio;
  }

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
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'category') {
      document.getElementById("vis").style.background="url('images/category_background.png') no-repeat";
      splitBubbles();
    } else {
      document.getElementById("vis").style.background="none";
      groupBubbles();
    }
  };


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
  myBubbleChart('#vis');
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
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
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
display();

// setup the buttons.
setupButtons();
});
