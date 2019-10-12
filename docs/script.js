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
    drawChart(dataset['monthlyVariance'], dataset['baseTemperature']);
  };
}

// Draw chart
function drawChart(dataset, baseTemp) {
  // Width and height of the svg area
  const w = 1000;
  const h = 500;
  const padding = 70;

  // size of the each cell
  const cellW = 4;

  // Min and Max value of the year
  const minX = d3.min(dataset, (d) => d['year']);
  const maxX = d3.max(dataset, (d) => d['year']);

  // Min and Max value of the variance
  const minVari = d3.min(dataset, (d) => d['variance']);
  const maxVari = d3.max(dataset, (d) => d['variance']);

  // Scale
  const xScale = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([padding, w - padding]);

  const yScale = d3
      .scaleBand()
      .domain(monthArr())
  // don't reverse
      .range([padding, h - padding]);

  function monthArr() {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push(new Date(Date.UTC(0, i, 1, 0, 0, 0, 0)));
    }
    console.log(arr);
    return arr;
  }

  // Define colors to be used
  const colors = ['#99ffcc', '#ccffcc', '#ffffcc', '#ffcc99', '#ff9966'];

  // Build color scale
  const colorScale = d3
      .scaleQuantize()
      .domain([minVari, maxVari])
      .range(colors);

  function monthIndex(month) {
    return month - 1;
  }

  // Define chart area
  const svg = d3
      .select('#graph')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

  // Plot data
  svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'cell') // required for the fcc test
      .attr('width', cellW)
      .attr('height', yScale.bandwidth())
      .attr('data-month', (d) => monthIndex(d['month']))
      .attr('data-year', (d) => d['year'])
      .attr('data-temp', (d) => d['variance'])
      .attr('fill', (d) => colorScale(d['variance']))
      .attr('x', (d) => xScale(d['year']))
      .attr('y', (d) =>
        yScale(new Date(Date.UTC(0, monthIndex(d['month']), 1, 0, 0, 0, 0)))
      )
  // tooltip
      .on('mouseover', function(d) {
        tooltip
            .style('visibility', 'visible')
        // id is required for fcc test
            .html('<p>Variance: ' + d['variance'] + '<br>' +
        'Year: ' + d['year'] + '<br>' +
        'Month' + d['month'] + '<br>' +
        '</p>')
        // required for fcc test
            .attr('data-year', d['year']);
      })
      .on('mousemove', function(d) {
        tooltip
            .style('top', d3.event.pageY - 20 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
      })
      .on('mouseout', function(d) {
        tooltip.style('visibility', 'hidden');
      });

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

  // Tooltip
  const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip'); // required for fcc test

  // legend

  // const sample = [minVari, baseTemp, maxVari]

  const sample = colors.map(function(color) {
    console.log(colorScale.invertExtent(color));
    return colorScale.invertExtent(color);
  });
  console.log(sample);

  // Scale for legend
  const legendScale = d3
      .scaleBand()
      .domain(sample.map(function(item) {
        return item[0];
      }))
      .range([0, 200]);

  // Define legend area
  const legendSvg = d3
      .select('#legend')
      .append('svg')
      .attr('width', 200)
      .attr('height', 40);

  // Display legend
  legendSvg
      .selectAll('rect')
      .data(sample)
      .enter()
      .append('rect')
      .attr('width', legendScale.bandwidth())
      .attr('height', 20)
      .attr('fill', (d) => colorScale(d[0]))
      .attr('x', (d, i) => i * legendScale.bandwidth())
      .attr('y', 0);

  // Configure axes
  const legendAxis = d3.axisBottom(legendScale).tickFormat(d3.format('.1'));

  // Draw x-axis
  legendSvg
      .append('g')
      .attr('transform', 'translate(0, 20)')
      .call(legendAxis);
}

// Display base temperature
function displayBaseTemperature(dataset) {
  d3.select('#basetemp').text(JSON.stringify(dataset));
}
