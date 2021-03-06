var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("../assets/data/data.csv").then(function(USdata) {

    //Parse Data/Cast as numbers

    USdata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare	= + data.healthcare;
      data.obesity	= +data.obesity;
      data.smokes	= +data.smokes;

    });

    function data_display() {

    var dtable = d3.select(".article").append("table")
    .classed("table table-striped", true)
    .attr("style", "margin-left: -10px; margin-top: 50px;");

    var dhead =dtable.append("thead").append("tr")
    .classed("theader", true);


    function makingheaders(data) {
    dhead.selectAll("tr")
    .data(USdata.slice(0,1))
    .enter().append("th")
    .text(data);   
    }
    
    makingheaders("State");
    makingheaders("Abbrevation");
    makingheaders("Poverty Rate");
    makingheaders("Obesity Rate");
    

    //displaying the data table
    dtable.selectAll("table")
    .data(USdata)
    .enter()
    .append("tr")
    .html(function(d) {
      return `<td>${d.state}</td><td>${d.abbr}</td><td>${d.poverty}</td><td>${d.obesity}</td>`;
    });

  };

  data_display();

  
    //Create scale functions

    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(USdata, d => d.poverty ))
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(USdata, d => d.obesity))
    .range([height, 0]);
    //Create axis functions

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);
    //Append Axes to the chart

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    //line generator
      var line = d3.line()
        .x(d => xLinearScale(d.poverty))
        .y(d => yLinearScale(d.obesity));
    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(USdata)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "12")
    .attr("stroke-width", "3");

    var circleLabels = chartGroup.selectAll(null).data(USdata).enter().append("text");

    circleLabels
      .attr("x", function(d) {
        return xLinearScale(d.poverty);
      })
      .attr("y", function(d) {
        return yLinearScale(d.obesity);
      })
      .text(function(d) {
        return d.abbr;
      })
      .classed("aText", true);
    
    //Initialize tool tip
    var toolTip = d3.tip()
    .attr("class","d3-tip")
    .attr("fill", "blue")
    .offset([40, 75])
    .html(function(d) {
      return (`${d.abbr}<br>Poverty Rate: ${d.poverty}%<br>Obesity Rate: ${d.obesity}%`);

    });

    chartGroup.call(toolTip);
    //Create tooltip in the chart

    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    //Create event listeners to display and hide the tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

   // Create axes labels
   chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left + 40)
   .attr("x", 0 - (height / 2))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Poverty Rate");

 chartGroup.append("text")
   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
   .attr("class", "axisText")
   .text("Obesity Rate");

  }).catch(function(error) {
    console.log(error);
  });

