/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

 d3.csv("data/leaders3.csv", function(dataActivities) {
   d3.csv("data/admin.csv", function (dataAdmins) {

function leadersChart() {
  // Constants for sizing
  var width = 900;
  var height = 600;
  var nodes = [];
  var radius = 40;
  var highlight_color = "#fff";
  var clicked_color = "#F1703F";
  var activity_colors = {
      "Sports/Recreation": "green",
      "Adventure Programs": "lightblue",
      "Youth Development": "gold",
      "Education": "pink"
  };

  var admin_colors = {
    "Ethics Committee": "red",
    "Financial Committee": "silver",
    "Marketing Committee": "orange",
    "Events Committee": "white"
  };

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var activityCenters = {
    "Sports/Recreation": { x: 250, y: 200 },
    "Adventure Programs": { x: 650, y: 175 },
    "Youth Development": { x: 250, y: 410 },
    "Education": { x: 650, y: 425 }
  };

  var activityTitle = {
    "Sports/Recreation": { x: 200, y: 30},
    "Adventure Programs": { x: 700, y: 30},
    "Youth Development": { x: 200, y: 350},
    "Education": { x: 700, y: 350}
  };

  var adminCenters = {
    "Ethics Committee": { x: 250, y: 190 },
    "Financial Committee": { x: 650, y: 190 },
    "Marketing Committee": { x: 250, y: 440 },
    "Events Committee": { x: 650, y: 440 }
  };

  var adminTitle = {
    "Ethics Committee": { x: 200, y: 30},
    "Financial Committee": { x: 700, y: 30},
    "Marketing Committee": { x: 200, y: 350},
    "Events Committee": { x: 700, y: 350}
  };

  // Used when setting up force and
  // moving around nodes
  var damper = 0.102;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;

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

    dataActivities.forEach(function(d){
        var bubble_node = {
          name: d.name,
          gender: d.gender,
          age: d.age,
          category: d.category,
          position: d.position,
          key: 2,
          bio: d.bio,
          url: d.url,
          x: Math.random() * 900,
          y: Math.random() * 800
      };

      nodes.push(bubble_node);
    });

    dataAdmins.forEach(function(d){
        var bubble_node = {
          name: d.name,
          gender: d.gender,
          age: d.age,
          category: d.category,
          position: d.position,
          key: 3,
          bio: d.bio,
          url: d.url,
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
  var chart = function chart(selector) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number by converting it
    // with `+`.

    nodes = createNodes();

    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

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
      .attr('stroke', highlight_color)
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
  function showActivityBubbles() {
    console.log("in showActivityBubbles");
    showActivityTitles();

    force.on('tick', function (e) {
      bubbles.each(moveToActivities(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function showAdminBubbles() {
    showAdminTitles();

    force.on('tick', function (e) {
      bubbles.each(moveToAdmin(e.alpha))
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


  function moveToActivities(alpha) {
    return function (d) {
      if (d.key == 2) {
        var target = activityCenters[d.category];
        d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
        d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
     } else
        unclickBubble(d, d3.select(this));
    };
  }

  function moveToAdmin(alpha) {
    return function (d) {
      if (d.key == 3) {
        var target = adminCenters[d.category];
        d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
        d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
     } else
        unclickBubble(d, d3.select(this));
    };
  }


  /*
   * Hides Year title displays.
   */
  function hideTitles() {
    console.log("svg.selectAll: " + svg.selectAll('.category'));
    svg.selectAll('.activity').remove();
    svg.selectAll('.admin').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showActivityTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    hideTitles();
    var activityData = d3.keys(activityTitle);
    var activities = svg.selectAll('.activity')
      .data(activityData);

    activities.enter().append('text')
      .attr('class', 'activity')
      .attr('x', function (d) {
          var target = activityTitle[d];
          return target.x; })
      .attr('y', function (d) {
          var target = activityTitle[d];
          return target.y})
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

  function showAdminTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    hideTitles();
    var adminData = d3.keys(adminTitle);
    var admin = svg.selectAll('.admin')
      .data(adminData);

    admin.enter().append('text')
      .attr('class', 'admin')
      .attr('x', function (d) {
          var target = adminTitle[d];
          return target.x; })
      .attr('y', function (d) {
          var target = adminTitle[d];
          return target.y})
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */

  function highlightBubble(d) {
    if (d3.select(this).classed("clicked") == false) {
        d3.select(this).attr('cursor', 'pointer')
                       .attr('stroke-width', '12');
    }

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
  }

  function updateBioBar(d) {
    document.getElementById("name_placeholder").style.display = "none";
    document.getElementById("leader_name").style.display = "block";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("leader_basic").style.display = "block";
    document.getElementById("leader_bio").style.display = "block";
    document.getElementById("leader_name").innerHTML = d.name;
    document.getElementById("age").innerHTML = d.age;
    document.getElementById("position").innerHTML = d.position;
    document.getElementById("bio_text").innerHTML = d.bio;
  }

  function showDetail(d) {
    // change outline to indicate hover state.
    bubbles.each(function(d) {
        d3.select(this).classed("clicked", false)
                       .attr('stroke', highlight_color)
                       .attr('stroke-width', 4);
    });

    updateBioBar(d);
    d3.select(this).classed("clicked", true)
                   .attr('stroke', clicked_color)
                   .attr('stroke-width', 12)
                   .attr('cursor', 'default');
  }

  function hideDetail(d) {
    document.getElementById("name_placeholder").style.display = "block";
    document.getElementById("leader_name").style.display = "none";
    document.getElementById("instructions").style.display = "block";
    document.getElementById("leader_basic").style.display = "none";
    document.getElementById("leader_bio").style.display = "none";
  }

  function unclickBubble(d, bubble) {
    if (bubble.classed('clicked') == true) {
        bubble.attr('stroke', highlight_color)
                       .attr('stroke-width', 4)
                       .classed('clicked', false);
        hideDetail(d);
    }
  }


  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */


  chart.toggleDisplay = function (displayName) {
    if (displayName == 'all')
      groupBubbles();

    else if (displayName === 'activity')
      showActivityBubbles();

    else if (displayName === 'admin')
      showAdminBubbles();
  };



  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = leadersChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  myBubbleChart('#leaders_chart');
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {

  // d3.select("#all").on('click', function() { console.log("clicked all"); groupBubbles(); });
  // d3.select("#activity").on("click", function() { showActivityBubbles(); });
  // d3.select("#admin").on("click", function() { showAdminBubbles(); });

  d3.select('#leaders_toggle_bar')
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
});
