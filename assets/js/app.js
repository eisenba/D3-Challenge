// @TODO: YOUR CODE HERE!
var svgWidth = document.getElementById('chart').clientWidth;
var svgHeight = svgWidth*.67;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("/assets/data/data.csv").then(function(censusData){
  // Parse data
  censusData.forEach(function(data){
      data.income = +data.income;
      data.smokes = +data.smokes;
  });
   // Create scale functions
   var xLinearScale = d3.scaleLinear()
   .domain([35000, d3.max(censusData.map(function (d) { 
       return d.income;
     })
   )]
   )
   .range([0, width]);

 var yLinearScale = d3.scaleLinear()
   .domain([5, d3.max(censusData.map( 
     function (d) {
       return d.smokes;
     }
   ))]
   )
   .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
 
    // Append Axes 
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
 
    chartGroup.append("g")
    .call(leftAxis);
 
  //Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", function(d) { 
  return xLinearScale(d.income);
  })
  .attr("cy", function(d) {
  return yLinearScale(d.smokes);
  })
  .attr("r", "12")
  .attr("fill", "#5cb2b5")
  .attr("opacity", ".65");

  //Initialize tool tip
  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .style("opacity",0)
  .html(function (d) {
  return (`${d.state}<br>Avg Income: ${d.income}<br>Smoker %: ${d.smokes}`);
  });
  
  //Create tooltip in the chart
  chartGroup.call(toolTip);

  //Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseenter", function (data) {
    toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
    toolTip.hide(data);
    });



});
