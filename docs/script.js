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
  d3.select("#graph")
  .append("p")
  .text(JSON.stringify(dataset));
}

// Display base temperature
function displayBaseTemperature(dataset) {
  d3.select("#basetemp")
  .text(JSON.stringify(dataset));
}
