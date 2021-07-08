//Initialise Axis values
var selectedX = "poverty";
var selectedY = "healthcare";

//For updating xScale when X axis label is clicked
function xScale(data, selectedX, chartWidth) {
  // Creating xLinearScale
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[selectedX]) * .8,
  d3.max(data, d => d[selectedX]) * 1.1])
    .range([0, chartWidth]);
  return xLinearScale;
}

//For updating xAxis when X axis label is clicked
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  return xAxis;
}

//For updating yScale when Y axis label is clicked
function yScale(data, selectedY, chartHeight) {
  // Creating yLinearScale
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[selectedY]) * .8,
  d3.max(data, d => d[selectedY]) * 1.2])
    .range([chartHeight, 0]);
  return yLinearScale;
}

//For updating yAxis when Y- axis label is clicked
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}
//For updating circlesGroup transition to new group
function renderCircles(circlesGroup, newXScale, newYScale, selectedX, selectedY) {
  circlesGroup.transition()
              .duration(1000)
              .attr("cx", d => newXScale(d[selectedX]))
              .attr("cy", d => newYScale(d[selectedY]));
  return circlesGroup;
}
//For updating the text in circlesGroup when transition to new group
function renderText(circletextGroup, newXScale, newYScale, selectedX, selectedY) {
  circletextGroup.transition()
                 .duration(1000)
                 .attr("x", d => newXScale(d[selectedX]))
                 .attr("y", d => newYScale(d[selectedY]));
  return circletextGroup;
}
//For updating circlesGroup with new tooltip
function updateToolTip(selectedX, selectedY, circlesGroup, textGroup) {
  // Conditional for X Axis
  if (selectedX === "poverty") {
        var xlabel = "Poverty: "; } 
  else if (selectedX === "income") {
        var xlabel = "Median Income:"; } 
  else {var xlabel = "Age:"; }
  // Conditional for Y Axis
  if (selectedY === "healthcare") {
        var ylabel = "No Healthcare:";} 
  else if (selectedY === "smokes") {
        var ylabel = "Smokers:"; } 
  else {var ylabel = "Obesity:"; }

    //Initialise toolTip
    var toolTip = d3.tip()
      .offset([50, 75])
      .attr("class", "d3-tip")
      .html(function(d) {
        if (selectedX === "age") {
        // All yAxis tooltip labels are fixed
        // Displaying Age for xAxis.
      return (`<b>${d.state}</b><hr>${xlabel} ${d[selectedX]}<br>${ylabel}${d[selectedY]}%`);} 
      
        else if (selectedX !== "poverty" && selectedX !== "age") {
        // Displaying Income for xAxis.
      return (`<b>${d.state}</b><hr>${xlabel}$${d[selectedX]}<br>${ylabel}${d[selectedY]}%`);} 
      
        else {
        // Displaying Poverty Rate for xAxis.
      return (`<b>${d.state}</b><hr>${xlabel}${d[selectedX]}%<br>${ylabel}${d[selectedY]}%`);}      
        });
        
    circlesGroup.call(toolTip);

    //Mouse over events for toolTip
    circlesGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    textGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

//For making the page responsive
function makeResponsive() {

    var svgArea = d3.select("#scatter").select("svg");
    // Clear SVG.
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    //setting SVG size to be responsive
    var svgWidth = window.innerWidth/1.3;
    var svgHeight = window.innerHeight/1.1;
    
    //Initialising margins for page
    var margin = {
      top: 20,
      right: 20,
      bottom: 80,
      left: 40
    };
    //Initialising Chart area 
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //Reading the data from the CSV file
    d3.csv(`D3_data_journalism/assets/data/data.csv`).then(function(USdata, err) {
     
        if (err) throw err;
        // Parse data
        USdata.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.income = +data.income;
            data.obesity = data.obesity;
        });

    //display sample data
    function data_display() {

        var dtable = d3.select(".article").append("table")
        .classed("table table-sm table-bordered table-primary", true)
        .attr("style", "margin-left: -10px; margin-top: 20px;");
      
          var dhead = dtable.append("thead").append("tr")
          .classed("theader thead-dark", true);

          var dbody = dtable.append("tbody")
          .classed("table-hover", true);

          //displaying the data headers
          function makingheaders(data) {
          dhead.selectAll("tr")
          .data(USdata.slice(0,1))
          .enter().append("th")
          .text(data);   
          }
          
          makingheaders("State");
          makingheaders("Abbr");
          makingheaders("Poverty Rate");
          makingheaders("Obesity Rate");
          
          //displaying the data table
          dbody.selectAll("table")
          .data(USdata)
          .enter()
          .append("tr")
          .html(function(d) {
            return `<td>${d.state}</td><td>${d.abbr}</td><td>${d.poverty}</td><td>${d.obesity}</td>`;
          });
      
        };
      
    data_display();

        // Create X & Y linear scales
        var xLinearScale = xScale(USdata, selectedX, chartWidth);
        var yLinearScale = yScale(USdata, selectedY, chartHeight);
        // Create initial axis functions
        var bottomAxis =d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        // Append X axis
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        // Append Y axis
        var yAxis = chartGroup.append("g")
            .call(leftAxis);
        //Using USdata for the circleGroup
        var circlesGroup = chartGroup.selectAll("circle")
            .data(USdata);
        // Bind data
        var elemEnter = circlesGroup.enter();
        // Creating circles
        var circle = elemEnter.append("circle")
            .attr("cx", d => xLinearScale(d[selectedX]))
            .attr("cy", d => yLinearScale(d[selectedY]))
            .attr("r", 14)
            .attr("stroke-width", "2")
            .classed("stateCircle", true);
        // Creating circle labels, using State Abbrevation as text
        var circleLabels = elemEnter.append("text")            
            .attr("x", d => xLinearScale(d[selectedX]))
            .attr("y", d => yLinearScale(d[selectedY]))
            .attr("dy", ".40em")
            .text(d => d.abbr)
            .classed("stateText", true);

        var circlesGroup = updateToolTip(selectedX, selectedY, circle, circleLabels);
        // Add X label groups and labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") 
            .classed("active", true)
            .text("Poverty Rate");
        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") 
            .classed("inactive", true)
            .text("Median Age");
        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Income");
        // Add Y labels group and labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)");
        var healthcareLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 40 - margin.left)
            .attr("dy", "1em")
            .attr("value", "healthcare")
            .classed("active", true)
            .text("No Healthcare");
        var smokesLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 20 - margin.left)
            .attr("dy", "1em")
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes");
        var obeseLabel = yLabelsGroup.append("text")
            .attr("x", 0 - (chartHeight / 2))
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obesity Rate");
        // X labels event listener
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                //Selected label
                selectedX = d3.select(this).attr("value");
                // Update xLinearScale
                xLinearScale = xScale(USdata, selectedX, chartWidth);
                // Render xAxis
                xAxis = renderXAxes(xLinearScale, xAxis);
                //Change the class according to selected Text
                if (selectedX === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (selectedX === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update circles with the new X values
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectedX, selectedY);
                // Update tool tips with new info
                circlesGroup = updateToolTip(selectedX, selectedY, circle, circleLabels);
                // Update circles text with the new value
                circleLabels = renderText(circleLabels, xLinearScale, yLinearScale, selectedX, selectedY);
            });
        // Y Labels event listener
        yLabelsGroup.selectAll("text")
            .on("click", function() {
                //Selected label
                selectedY = d3.select(this).attr("value");
                // Update yLinearScale
                yLinearScale = yScale(USdata, selectedY, chartHeight);
                // Update yAxis
                yAxis = renderYAxes(yLinearScale, yAxis);
                //Change the class according to selected Text
                if (selectedY === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (selectedY === "smokes"){
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                // Update circles with the new Y values
                circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectedX, selectedY);
                // Update circles text with new values
                circleLabels = renderText(circleLabels, xLinearScale, yLinearScale, selectedX, selectedY);
                // Update tool tips with  the new info
                circlesGroup = updateToolTip(selectedX, selectedY, circle, circleLabels);
            });
    }).catch(function(err) {
        console.log(err);
    });
}

makeResponsive();
//Event listener when browser window is resized
d3.select(window).on("resize", makeResponsive);
