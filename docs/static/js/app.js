const url ='https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
d3.json(url).then(function(data) {
    //console.log(data1);
});

//initialization 
function init(){
    //dropdown menu
    let dropDownMenu = d3.select("#selDataset");

    //get data to populate the dropdown menu
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach(id => {
            dropDownMenu.append("option").text(id).property("value", id);
        });
        let sampleOne = names[0];

        getData(sampleOne);
        BarChart(sampleOne);
        BubbleChart(sampleOne);
    });
};

// get data 
function getData(sample){
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        let valueData = value[0];
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

//bar chart
function BarChart(sample){
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let otuIds = valueData.otu_ids;
        let otuLabels = valueData.otu_labels;
        let sampleValues = valueData.sample_values;
        let yVals = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xVals = sampleValues.slice(0,10).reverse();
        let labels = otuLabels.slice(0,10).reverse();
        let trace1 = {
        x: xVals,
        y: yVals,
        text: labels,
        type: "bar",
        orientation: "h"
        };  
        let layout = {
            title: "Top 10 OTUs Present"
        };
        Plotly.newPlot("bar", [trace1], layout)

    });
}; 

//bubble chart
function BubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);

        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

//updates dashboard
function optionChanged(value) { 
    console.log(value); 
    getData(value);
    BarChart(value);
    BubbleChart(value);
    GaugeChart(value);
};

// Call initialize 
init();