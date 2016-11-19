d3.csv("test1.csv", function(data1) {
  d3.csv("test2.csv", function(data2) {

function bubbleChart() {
  // Constants for sizing
  var width = 956.56; //1200
  var height = 800; //860;
  variantNodes = [];

  var bubbleColors = {"Protective": "#89b4fd",
                      "Benign": "#ccc",
                      "Pathogenic": "#ff6666",
                      "PathCarrier": "url(#PathDiag)", //for the carrier
                      "BenCarrier": "url(#BenDiag)", //for the carrier
                      "ProtCarrier": "url(#ProtDiag)", //for the carrier
                      "Pharmacogenetic": "purple",
                      "PharmCarrier": "url(#PharmDiag)", //for the carrier
                      "Unknown": "url(#UnkDiag)" //special diag for unknown
                    };

  var bubbleStrokes = {'Pathogenic': '#ff6666',
                       'Protective': '#89b4fd',
                       'Benign': '#ccc',
                       'Pharmacogenetic': 'purple',
                       'Unknown': '#000'
                     };

  // tooltip for mouseover functionality
  // var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 3 };

  var columnCenters = {
    1: { x: width / 3.05, y: height / 2.3 },
    2: { x: width / 2.1, y: height / 2.35 },
    3: { x: 2 * width / 3, y: height / 2.3 }
  };

  // X locations of the year titles.
  var columnTitleX = {
    "Jamie": 250,
    "Similarities": width / 2,
    "Jessie": width - 300
  };

  // Used when setting up force and
  // moving around nodes
  var damper = 0.102;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];
  var pathNodes = [];
  var protNodes = [];
  var benNodes = [];
  var pharmaNodes = [];

  // Charge function that is called for each node.
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  // Charge is negative because we want nodes to repel.
  // Dividing by 8 scales down the charge to be
  // appropriate for the visualization dimensions.
  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  // Here we create a force layout and
  // configure it to use the charge function
  // from above. This also sets some contants
  // to specify how the force layout should behave.
  // More configuration is done below.
  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.03)
    .friction(0.9);


  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2, 14]);



  /*--------------------------------------------------------------
    setRadius (HELPER FUNCTION)
    -------------------------------------------------------------*/

  function setRadius(frequency) {
  /*Calculates a radius based on a variant's frequency/rarity*/
      var radius;

      /*Overwrite variant frequency if it's unlisted or 1.0*/
      if (frequency == "" || frequency == "1.0")
          frequency = 0.9;

      radius = -Math.log(frequency);
      if (radius < 1)
          radius = 0.8;

      return radius
 }

 /*--------------------------------------------------------------
   setColumn (HELPER FUNCTION)
   -------------------------------------------------------------*/

 function setColumn(variant, array, num) {
 /*Determines which column of the venn diagram a variant belongs to
   and returns the variant's column number. */

    var column = num; //column number of a participant's unique variants

    /*Check to see if the given variant is shared between both participants
    by looping through a given array of shared variants.*/
    for(i = 0; i < array.length; i++) {
       if (variant == array[i])
          column = 2; //column number for shared variants
    }

     return column;
}


  /*----------------------------------------------------------------------
    createNodes FUNCTION
  -----------------------------------------------------------------------*/

  function createNodes() {
  /*This data manipulation function takes the raw data from both CSV files
    and converts it into an array of unique node objects (shared variants
    are only listed once in the array). Each node will store data and
    visualization values to visualize a bubble.*/

    /*-------------------------------------------------------------------
      Using the data from both csv files, create an array that
      lists the names of all shared variants.
    -----------------------------------------------------------------*/

      var variants1 = [];
      var variants2 = [];
      var commonVariants = [];
      var filterArray = Array.prototype.slice.call(arguments);

      /*Push all variant names from first csv file to an array*/
      data1.forEach(function(d) {
        variants1.push(d.variant);
      });

      /*Push all variant names from second csv file to an array*/
      data2.forEach(function(d) {
        variants2.push(d.variant);
      });

      /*Push all shared variants into the commonVariants array*/
      for (i = 0; i < variants1.length; i++) {
        for (j = 0; j < variants2.length; j++) {

          if (variants1[i] == variants2[j])
            commonVariants.push(variants1[i]);
        }
      }

    /*--------------------------------------------------------------------------------
      DATA FROM FIRST CSV FILE: Create an object "bubbleNode" that
      represents each variant (and its attributes) from the csv file
    --------------------------------------------------------------------------------*/
    data1.forEach(function(d) {
        var bubbleNode = {
            name: d.variant,
            category: d.category.split(";"),
            clinical: d.clinical_importance,
            impact: d.impact,
            zygosity: d.zygosity,
            inheritance: d.inheritance,
            penetrance: d.penetrance_score,
            frequency: d.frequency,
            group: null,
            comment: d.summary,
            evidence: d.evidence,
            url: d.getev_report_url,
            radius: radiusScale(setRadius(d.frequency)),
            color: null,
            column: setColumn(d.variant, commonVariants, 1),
            x: Math.random() * 900,
            y: Math.random() * 800
        };

        variantNodes.push(bubbleNode);
    });

    /*--------------------------------------------------------------------------------
      DATA FROM SECOND CSV FILE: Create an object "bubbleNode" that
      represents variants (and its attributes) that are unique to
      the second csv file and not shared with the first csv file
    --------------------------------------------------------------------------------*/

    data2.forEach(function(d) {

      /*Determine the column number of each variant read-in from file*/
      var column = setColumn(d.variant, commonVariants, 3);

      if (column == 3) {
          var bubbleNode = {
              name: d.variant,
              category: d.category.split(";"),
              clinical: d.clinical_importance,
              impact: d.impact,
              zygosity: d.zygosity,
              inheritance: d.inheritance,
              penetrance: d.penetrance_score,
              frequency: d.frequency,
              group: null,
              comment: d.summary,
              evidence: d.evidence,
              url: d.getev_report_url,
              radius: radiusScale(setRadius(d.frequency)),
              color: null,
              column: column,
              x: Math.random() * 900,
              y: Math.random() * 800
          };
          variantNodes.push(bubbleNode);
      }
    });

  /*Sort nodes to prevent occlusion of smaller bubble nodes*/
  variantNodes.sort(function (a, b) { return b.value - a.value; });

  return variantNodes;
}

/*----------------------------------------------------------------------
  PREPARING BUBBLE CHART
-----------------------------------------------------------------------*/

  var chart = function chart(selector) {
  /*Function prepares the data for visualization by adding an svg element
    to the provided selector and starting the visualization creation process.
    Selector is a DOM element or CSS selector that points to the parent element
    of the bubble chart.*/

    // pathNodes = createNodes("Pathogenic");
    // protNodes = createNodes("Protective");
    // benNodes = createNodes("Benign");
    // pharmaNodes = createNodes ("Pharmacogenetic");

    nodes = createNodes();

    /*Set the force's nodes to our newly created nodes array.*/
    force.nodes(nodes);

    /*Create a SVG element inside the provided selector with desired size.*/
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    /*Bind nodes data to what will become DOM elements to represent them.*/
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.name; });

    /*Create new circle elements each with class "bubble". There will be
      one circle.bubble for each object in the nodes array. Initially,
      their radius (r attribute) will be 0.*/
      //function to create  a generic pattern
       //takes inputs of idName and color


   //PATTERNS for filling the carriers:

   function createPattern1(idName, url) {
         svg.append('defs')
            .append('pattern')
            .attr("id", idName)
            .attr("width", "48")
            .attr("height", "48")
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:image")
            .attr("xlink:href", url)
            .attr("width", "48")
            .attr("height", "48")
            .attr("x", 0)
            .attr("y", 0);
       }

   //creating the patterns. nothing further needs to be done for these to work.
   createPattern1('PathDiag', 'http://2.bp.blogspot.com/-QnFtbHKbeW8/U6wYza5m9dI/AAAAAAAAfOo/Ven4iGIDeXc/s1600/red_polka_dot_paper.jpg');
   createPattern1('BenDiag', 'http://www.babybedding.com/images/fabric/white-and-gray-polka-dot-fabric_medium.jpg');
   createPattern1('ProtDiag', 'http://www.featurepics.com/StockImage/20080825/baby-blue-polka-dots-stock-illustration-867492.jpg');
  //  createPattern1('PharmDiag', "purple");
  //  createPattern1('UnkDiag', "green");

   /*--------------------------------------------------------------
     setColor (HELPER FUNCTION)
     -------------------------------------------------------------*/

   function setColor(d, impact, inheritance, zygosity) {
   /*Determine a bubble's color based on impact, inheritance, and zygosity*/

       var color;

       if (zygosity == "Heterozygous" && inheritance == "Recessive") { //determining if the person is a carrier
           if (impact == "Pathogenic")
               d.group = "PathCarrier";

           if (impact == "Protective") {
              d.group = "ProtCarrier"
           }
           if (impact == "Benign" || impact == "Not Reviewed") {
              d.group = "BenCarrier";
           }
           if (impact == "Pharmacogenetic") {
               d.group = "PharmCarrier";
           }
           if (impact == "Not Reviewed" ||
              (inheritance == "Unknown" || inheritance == "Complex/Other")) {
               d.group = "Unknown";
           }
       } else //if the person is not a carrier
           d.group = impact;

       return bubbleColors[d.group];
     }


    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('impact', function (d) { return d.impact; })
      .attr('r', 0)
      .attr('visibility', 'visible')
      .attr('fill', function (d) {
           d.color = setColor(d, d.impact, d.inheritance, d.zygosity);
           console.log("d.color: " + d.color);
           return d.color; })
      .attr('stroke', function (d) { return d3.rgb(bubbleStrokes[d.impact]).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', onBubble)
      .on('mouseout', offBubble)
      .on('click', show_details);


    /*Fancy transition to make bubbles appear, ending with the correct radius*/
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    /*Set initial layout to single group.*/
    splitBubbles();
  };

/*----------------------------------------------------------------------
  FUNCTIONS FOR VENN DIAGRAM MODE
-----------------------------------------------------------------------*/
  function splitBubbles() {
  /*Sets visualization in "venn diagram mode". The huId labels are shown
    and the force layout tick function is set to move nodes to the
    columnCenter of the venn diagram.*/

    showYears();

    force.on('tick', function (e) {
      bubbles.each(moveToYears(e.alpha))
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

  /*---------------HELPER FUNCTION--------------------*/
  function moveToYears(alpha) {
  /*Returns a function that takes the data for a single
    node and adjusts the position values of that node to
    move it the column  center for that node.*/

    return function (d) {
      var target = columnCenters[d.column];
          d.x = d.x + (target.x -d.x) * damper * alpha * 1.1;

          if (d.group == "Pathogenic")
              d.y = d.y + (target.y - d.y - 50) * damper * alpha * 1.1;

          else if (d.group == "PathCarrier")
              d.y = d.y + (target.y - d.y - 30) * damper * alpha * 1.1;

          else if (d.group == "Protective")
              d.y = d.y + (target.y - d.y - 10) * damper * alpha * 1.1;


          else if (d.group == "ProtCarrier")
              d.y = d.y + (target.y - d.y + 10) * damper * alpha * 1.1;


          else if (d.group == "Benign")
              d.y = d.y + (target.y - d.y + 30) * damper * alpha * 1.1;


          else if (d.group == "BenCarrier")
              d.y = d.y + (target.y - d.y + 50) * damper * alpha * 1.1;

          else if (d.group == "Pharmacogenetic")
              d.y = d.y + (target.y - d.y + 70) * damper * alpha * 1.1;

          else if (d.group == "PharmCarrier")
              d.y = d.y + (target.y - d.y + 90) * damper * alpha * 1.1;

          else
              d.y = d.y + (target.y - d.y + 100) * damper * alpha * 1.1;
    };

  }


  /* Shows Year title displays.*/
  function showYears() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var yearsData = d3.keys(columnTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return columnTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */


  function onBubble(d) {
      if (d3.select(this).attr("class") != "bubble clicked") {
          d3.select(this).attr('stroke', 'black')
                         .attr('stroke-width', '4')
                         .attr('cursor', 'pointer');}
  }

  function offBubble(d) {
    console.log("d.clicked: " + d3.select(this).attr("class"));
      if (d3.select(this).attr("class") != "bubble clicked") {
          d3.select(this).attr('stroke', d3.rgb(bubbleStrokes[d.impact]).darker())
                     .attr('stroke-width', '2')
                     .attr('cursor', 'none');
      }
  }

  /* function to show the details of a clicked variant */
  function show_details(d) {

    bubbles.each(function (d) {
      d3.select(this).attr('stroke', d3.rgb(bubbleStrokes[d.impact]).darker())
                     .attr('stroke-width', '2')
                     .classed('clicked', false);
    });

    d3.select(this).classed("clicked", true);
    d3.select(this).attr('stroke', 'yellow')
                   .attr('stroke-width', '4')
                    .attr('cursor', 'default');

    // var names_original =[];
    // var names_other = [];
    //
    // names_original = element.getAttribute("name").split(" ");
    //   for (var g=0; g<nodes.length; g++) {
    //     names_other = nodes[g].name.split(" ");
    //
    //   if (names_original[0] == names_other[0]) {
    //     document.getElementsByName(nodes[g].name)[0].setAttribute("stroke", "black");
    //     document.getElementsByName(nodes[g].name)[0].setAttribute("stroke-width", 4)
    //   }
    // }

    var risk ="";

    //only "risk" if it is pathogenic
    if (d.impact == "Pathogenic") {
      if (d.penetrance == 0) {
        risk = "Up to 0.1% increased risk (extremely low penetrance)";
      } else if (d.penetrance == 1) {
        risk = "0.1% - 1% increased risk (very low penetrance)";
      } else if (d.penetrance == 2) {
        risk = "1% - 5% increased risk (low penetrance)";
      } else if (d.penetrance == 3) {
        risk = "5% - 20% increased risk (moderate penetrance)";
      } else if (d.penetrance == 4) {
        risk = "20% - 50% increased risk (moderately high penetrance)";
      } else if (d.penetrance == 5) {
        risk = "50% - 100% increased risk (complete or highly penetrant)";
      } else {
        risk = "Unknown.";
      }
    } else { //not pathogenic, use "chance"
      if (d.penetrance == 0) {
        risk = "Up to 0.1% increased chance (extremely low penetrance)";
      } else if (d.penetrance == 1) {
        risk = "0.1% - 1% increased chance (very low penetrance)";
      } else if (d.penetrance == 2) {
        risk = "1% - 5% increased chance (low penetrance)";
      } else if (d.penetrance == 3) {
        risk = "5% - 20% increased chance (moderate penetrance)";
      } else if (d.penetrance == 4) {
        risk = "20% - 50% increased chance (moderately high penetrance)";
      } else if (d.penetrance == 5) {
        risk = "50% - 100% increased chance (complete or highly penetrant)";
      } else {
        risk = "Unknown.";
      }
    }

    var rare="";
    var data_rarity = d.frequency*100; //save the right decimal point of data.rarity

    if (d.frequency == "") {

      rare = "Unknown.";

    } else if (d.zygosity == "Heterozygous") {  //This person is heterozygous

      var rare_number = (2 * d.frequency * (1-d.frequency))*100;

      //getting the right decimal point for rare_number
      if (rare_number>=10) {
      rare_number = rare_number.toFixed(0);
      } else if (rare_number>=1 && rare_number<10) {
        rare_number = rare_number.toFixed(1);
      } else if (rare_number>=0.1 && rare_number<1) {
        rare_number = rare_number.toFixed(2);
      } else if (rare_number>=0.01 && rare_number<0.1) {
        rare_number = rare_number.toFixed(3);
      } else if (rare_number>=0.001 && rare_number<0.01) {
        rare_number = rare_number.toFixed(3);
      }

      //getting the right decimal point for data_rarity
      if (data_rarity>=10) {
      data_rarity = data_rarity.toFixed(0);
      } else if (data_rarity>=1 && data_rarity<10) {
        data_rarity = data_rarity.toFixed(1);
      } else if (data_rarity>=0.1 && data_rarity<1) {
        data_rarity = data_rarity.toFixed(2);
      } else if (data_rarity>=0.01 && data_rarity<0.1) {
        data_rarity = data_rarity.toFixed(3);
      } else if (data_rarity>=0.001 && data_rarity<0.01) {
        data_rarity = data_rarity.toFixed(4);
      }

      rare = rare_number + "% of people have one copy of this, like you ("+ data_rarity + "% allele frequency)";

    } else if (d.zygosity == "Homozygous") { //This person is homozygous

      var rare_number = (d.frequency*d.frequency)*100;

      //getting the right decimal point for rare_number
      if (rare_number>=10) {
      rare_number = rare_number.toFixed(0);
      } else if (rare_number>=1 && rare_number<10) {
        rare_number = rare_number.toFixed(1);
      } else if (rare_number>=0.1 && rare_number<1) {
        rare_number = rare_number.toFixed(2);
      } else if (rare_number>=0.01 && rare_number<0.1) {
        rare_number = rare_number.toFixed(3);
      } else if (rare_number>=0.001 && rare_number<0.01) {
        rare_number = rare_number.toFixed(4);
      }

      //getting the right decimal point for data_rarity
      if (data_rarity>=10) {
      data_rarity = data_rarity.toFixed(0);
      } else if (data_rarity>=1 && data_rarity<10) {
        data_rarity = data_rarity.toFixed(1);
      } else if (data_rarity>=0.1 && data_rarity<1) {
        data_rarity = data_rarity.toFixed(2);
      } else if (data_rarity>=0.01 && data_rarity<0.1) {
        data_rarity = data_rarity.toFixed(3);
      } else if (data_rarity>=0.001 && data_rarity<0.01) {
        data_rarity = data_rarity.toFixed(4);
      }

      rare = rare_number + "% of people have two copies of this, like you ("+ data_rarity + "% allele frequency)";

    }

    //making the categories print pretty:
    var categories_string = "";
    for (var i = 0; i<d.category.length; i++) {
      categories_string += d.category[i];
      if (i+1<d.category.length) {
        categories_string += "; ";
      }
    }

    document.getElementById("var-intro").style.display="none";
    document.getElementById("var-details").style.display="block";
    document.getElementById("var_info").innerHTML=d.name;
    document.getElementById("var-summary-info").innerHTML=d.comment;
    document.getElementById("var-certainty-info").innerHTML=d.evidence;
    document.getElementById("var-effect-info").innerHTML=d.clinical;
    document.getElementById("var-impact-info").innerHTML=d.impact;
    document.getElementById("var-rarity-info").innerHTML=rare;
    document.getElementById("var-risk-info").innerHTML=risk;
    document.getElementById("var-category-info").innerHTML=d.category;
    if (d.inheritance == "Recessive" && d.zygosity == "Heterozygous"){
      document.getElementById("var-affected-info").innerHTML='0'; //carrier
    } else {
      document.getElementById("var-affected-info").innerHTML='1'; //affected
    }

    document.getElementById("var_info").innerHTML= "<b>" + d.name + "</b>";

  }

  function showDetail(d) {

    var variant_clicked = d.name;
    bubbles.each(function (d) {
      d3.select(this).attr('stroke', d3.rgb(bubbleStrokes[d.impact]).darker())
                     .attr('stroke-width', '2')
                     .classed('clicked', false);
    });

    d3.select(this).classed("clicked", true);
    d3.select(this).attr('stroke', 'yellow')
                   .attr('stroke-width', '4')
                    .attr('cursor', 'default');




    // tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(d.color).darker());

    tooltip.hideTooltip();
  }


  function filterImpact() {

      if (document.getElementById("impact_filter")
              .options[impact_filter.selectedIndex].value == "Show All") {

          bubbles.each(function(d) {
              d3.select(this).style("opacity", "1");
          });

      } else {

          var selected = document.getElementById("impact_filter")
                              .options[impact_filter.selectedIndex].value;

          bubbles.each(function(d) {
            if (d.impact == selected)
              d3.select(this).style("opacity", "1");

            else
              d3.select(this).style("opacity", "0");
         });
      }

    splitBubbles();
  }

  function filterCategory() {

    if (document.getElementById("category_filter")
            .options[category_filter.selectedIndex].value == "Show All") {

        bubbles.each(function(d) {
            d3.select(this).style("opacity", "1");
        });

    } else {

        var selected = document.getElementById("category_filter")
                            .options[category_filter.selectedIndex].value;

        bubbles.each(function(d) {
          var category = d.category.toString();
          console.log("category: " + selected);
          console.log("d.category: " + d.category);
          if (category.search(selected) != -1) {
            console.log("YAY MATCH!");
            d3.select(this).style("opacity", "1");

          } else {
            console.log("No Match");
            d3.select(this).style("opacity", "0");
          }
       });
    }

  splitBubbles();
  }

  function filterEvidence() {

    if (document.getElementById("evidence_filter")
            .options[evidence_filter.selectedIndex].value == "Show All") {

        bubbles.each(function(d) {
            d3.select(this).style("opacity", "1");
        });

    } else {

        var selected = document.getElementById("evidence_filter")
                            .options[evidence_filter.selectedIndex].value;

        bubbles.each(function(d) {
          if (d.evidence == selected) {
            console.log("YAY MATCH!");
            d3.select(this).style("opacity", "1");

          } else {
            console.log("No Match");
            d3.select(this).style("opacity", "0");
          }
       });
    }

  splitBubbles();
  }

  function filterClinical() {
    if (document.getElementById("clinical_filter")
            .options[clinical_filter.selectedIndex].value == "Show All") {

        bubbles.each(function(d) {
            d3.select(this).style("opacity", "1");
        });

    } else {

        var selected = document.getElementById("clinical_filter")
                            .options[clinical_filter.selectedIndex].value;

        bubbles.each(function(d) {
          if (d.clinical == selected) {
            console.log("YAY MATCH!");
            d3.select(this).style("opacity", "1");

          } else {
            console.log("No Match");
            d3.select(this).style("opacity", "0");
          }
       });
    }

  splitBubbles();
  }

  function filterCarrier() {
    if (document.getElementById("carrier_filter")
            .options[carrier_filter.selectedIndex].value == "Show All") {

        bubbles.each(function(d) {
            d3.select(this).style("opacity", "1");
        });

    } else {

        var selected = document.getElementById("carrier_filter")
                            .options[carrier_filter.selectedIndex].value;

        bubbles.each(function(d) {
          var group = d.group;
          var status;

          console.log("d.group: " + d.group);
          if (group.search("Carrier") == -1)
              status = "affected";
          else
              status = "carrier";
          console.log("status: " + status);
          // console.log("status: " + status);
          // console.log("selected: " + selected);
          if (status == selected) {
            console.log("YAY MATCH!");
            d3.select(this).style("opacity", "1");

          } else {
            console.log("No Match");
            d3.select(this).style("opacity", "0");
          }
       });
    }

  splitBubbles();
  }


  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */

    if (document.getElementById("tab1").checked == true) {
        console.log(document.getElementById("tab1").checked);
        console.log("tab1 checked!!!");
        document.getElementById("vis").style.backgroundColor= "yellow"; //"url('img/venn.png') no-repeat";
        document.getElementById("impact_filter").addEventListener("change", filterImpact);
        document.getElementById("category_filter").addEventListener("change", filterCategory);
        document.getElementById("evidence_filter").addEventListener("change", filterEvidence);
    } else if (document.getElementById("tab1").checked == false){
      console.log("ooopppss-not recognizing tab1");
      document.getElementById("impact_filter").value="Show All";
      document.getElementById("category_filter").value="Show All";
      document.getElementById("evidence_filter").value="Show All";
      d3.selectAll('.bubble').style('opacity', '1');
    }


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
function display() {
  myBubbleChart('#vis');
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */

function filterButton(menu_id) {
  d3.selectAll(".filter").style("visibility", "hidden");
  d3.selectAll(".filter").each(function() { this.value="Show All";});
  d3.selectAll(".button").each(function() { d3.select(this).style("disabled", "false");
                                            d3.select(this).style("cursor", "pointer");});
  d3.selectAll('.bubble').style('opacity', '1');
  d3.select(menu_id).style("visibility", "visible");
}

function setupButtons() {

  d3.select("#impact_button").on('click', function() { filterButton("#impact_filter")});
  d3.select("#category_button").on('click', function() { filterButton("#category_filter")});
  d3.select("#evidence_button").on('click', function() { filterButton("#evidence_filter")});
  d3.select("#clinical_button").on('click', function() { filterButton("#clinical_filter")});
  d3.select("#carrier_button").on('click', function() { filterButton("#carrier_filter")});

  // d3.select('#toolbar')
  //   .selectAll('.button')
  //   .on('click', function ()
  //     // Remove active class from all buttons
  //     d3.selectAll('.button').classed('active', false);
  //     // Find the button just clicked
  //     var button = d3.select(this);
  //
  //     // Set it as the active button
  //     button.classed('active', true);
  //
  //     // Get the id of the button
  //     var buttonId = button.attr('id');
  //
  //     // Toggle the bubble chart based on
  //     // the currently clicked button.
  //     myBubbleChart.toggleDisplay(buttonId);

}

var saved_LW =[];
function is_saved_LW (variant_LW) {
  //ensure a variant is selected
  if (variant_LW === "Example Variant") {
    return true;
  }
  //check if variant is already saved
  for (var i = saved_LW.length - 1; i >= 0; i--) {
    console.log(saved_LW[i]);
    if (saved_LW[i] === variant_LW) {
      alert(variant_LW + " is already saved.")
      return true;
    }
  };
  //alert(variant_LW + " NOT SAVED YET!")
  return false;
}

var $template = $(".template");
var hash = 2;
$(".btn-add-panel").on("click", function () {
  var panel_header = document.getElementById('var_info').innerHTML;
  if (!is_saved_LW(panel_header)) {
    var panel_contents = document.getElementById('second_info').innerHTML;
    //alert(panel_header);
    var $newPanel = $template.clone();
    $newPanel.find(".collapse").removeClass("in");
    $newPanel.find(".accordion-toggle").attr("href", "#" + (++hash))
        .text(panel_header);
    $newPanel.find(".panel-body").html(panel_contents);
    $newPanel.find(".panel-collapse").attr("id", hash);
    $newPanel.find(".glyphicon-remove-circle").attr("id", panel_header);
    $("#accordion").append($newPanel.fadeIn());
    saved_LW.push(panel_header);
    $("#clicked-variant").hide();
    track_save (panel_header,'pin');
  }
});

$(document).on('click', '.glyphicon-remove-circle', function () {
    //get the variant name stored in circle id
    var to_delete = $(this).attr('id');
    //remove variant from saved array
    var index = saved_LW.indexOf(to_delete);
    saved_LW.splice(index, 1);
    //remove panel from accordion
    $(this).parents('.panel').get(0).remove();
    track_save (to_delete,'unpin');
});


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

// Display chart
display();

// setup the buttons.
setupButtons();
//setupFilters();

});
});
