const dataUrl =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

getDataset();

// Retrieve the dataset
function getDataset() {
  // Instanciate XMLHttpRequest Object
  req = new XMLHttpRequest();
  // Initialize GET request
  req.open('GET', dataUrl, true);
  // Send the request
  req.send();
  // onload event handler
  req.onload = function() {
    // Parse the returned JSON string to JavaScript object
    json = JSON.parse(req.responseText);
    // use the value of "data" only
    const dataset = json;
    displayBaseTemperature(dataset['baseTemperature']);
    drawChart(dataset['monthlyVariance']);
  };
};

// Draw chart
function drawChart(dataset) {

  // Width and height of the svg area
  const w = 1000;
  const h = 500;
  const padding = 50;

  // size of the each cell
  const cell_w = 4;
  const cell_h = 20;

  // Min and Max value of the year
  const minX = d3.min(dataset, (d) => d['year'])
  const maxX = d3.max(dataset, (d) => d['year'])

  // Min and Max value of the variance
  const minVari = d3.min(dataset, (d) => d['variance'])
  const maxVari = d3.max(dataset, (d) => d['variance'])

  // Scale
  const xScale = d3.scaleLinear()
                   .domain([minX, maxX])
                   .range([padding, w - padding]);

  const yScale = d3.scaleBand()
                   .domain(monthArr())
                   // don't reverse
                   .range([padding , h - padding]);

function monthArr() {
  let arr = [];
  for (var i=0; i<12; i++) {
    arr.push(new Date(Date.UTC(0, i, 1, 0, 0, 0, 0)));
  }
  console.log(arr);
  return arr;
}

  // Build color scale
  var colorScale = d3.scaleQuantize()
    .domain([minVari, maxVari])
    .range(["#99ffcc", "#ccffcc", "#ffffcc", "#ffcc99", "#ff9966"]);

  function monthIndex(month) {
    return month - 1;
  }

  // Define chart area
  const svg = d3.select("#graph")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  // Plot data
  svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "cell") // required for the fcc test
  .attr("width", cell_w)
  .attr("height", yScale.bandwidth())
  .attr("data-month", (d) => monthIndex(d['month']))
  .attr("data-year", (d) => d['year'])
  .attr("data-temp", (d) => d['variance'])
  .attr("fill", (d) => colorScale(d['variance']))
  .attr("x", (d) => xScale(d['year']))
  .attr("y", (d) => yScale(new Date(Date.UTC(0, monthIndex(d['month']), 1, 0, 0, 0, 0))));

  // Configure axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

  // Draw x-axis
  svg
  .append('g')
  .attr('transform', 'translate(0,' + (h - padding) + ')')
  .attr('id', 'x-axis') // required for the fcc test
  .call(xAxis);

  // Draw y-axis
    svg
    .append('g')
    .attr('transform', 'translate(' + padding + ', 0)')
    .attr('id', 'y-axis') // required for the fcc test
    .call(yAxis);
}

// Display base temperature
function displayBaseTemperature(dataset) {
  d3.select("#basetemp")
  .text(JSON.stringify(dataset));
}
