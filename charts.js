function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    console.log(samplesData);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleResults = sampleArray[0];
    console.log(sampleResults);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_Ids = sampleResults.otu_ids;
    var otu_Labels = sampleResults.otu_labels;
    var sample_Values = sampleResults.otu_values;
    console.log(otu_Ids);
    console.log(otu_Labels);
    console.log(sample_Values);

    // 7. Create the yticks for the bar chart.

    var yticks = sampleResults.otu_ids.slice(0,10).map(otu_Id => `otu_Id ${otu_Id}`).reverse();
    console.log(yticks);
    var xticks = sampleResults.sample_values.slice(0,10).reverse();
    console.log(xticks);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: xticks,
      y: yticks,
      text: otu_Labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };
    
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      type: "bubble",
      x: otu_Ids,
      y: sample_Values,
      text: otu_Labels,
      mode: 'markers',
      marker: {
        size: sample_Values,
        color: otu_Ids,
        colorscale: "Rainbow",
      }
  };

    var trace2 = [bubbleData];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      xaxis: {title: "OTU-ID"},
      title: 'Bacteria Cultures Per Sample',
      hovermode: "closest",
      height: 600,
      width: 1200,
      barmode: 'group'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', trace2, bubbleLayout); 

    // Create the data gauge for wash frequency
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeData = data.metadata;
    var metadataArray = gaugeData.filter(metaData => metaData.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResults = metadataArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = metadataResults.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeChart = [
      {
        type: "indicator", 
        mode: "gauge+number",
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week", color: "black", font: {size: 24}},
        delta: { reference: 10, increasing: { color: "black"}},
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black"},
          bar: {color: "black"},
          bgcolor: "black",
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            { range: [0, 2], color: "red"},
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "lightgreen"},
            { range: [8, 10], color: "green"}
          ],
          threshold: {
            line: { color: "red", width: 4},
            thickness: 0.75,
            value: 10
          }

        }

      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: "white",
      font: {color: "black", family: "Arial"}     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeChart, gaugeLayout);
  });
}

