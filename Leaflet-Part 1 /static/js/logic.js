// Map variable that points to United States - coordinates: 39.5501° N, 105.7821° W
var myMap = L.map("map", {
    center: [39.5501, -105.7821],
    zoom: 5
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Access the JSON earthquake data URL endpoint (M2.5+ Earthquakes in the past 7 days)
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(function(data){

    // Check results using console.log()
    console.log(data)

    // Create a list to hold the markers
    var markers = [];

    // Create function for marker size based on earthquake magnitude
    function markerSize(magnitude)
    {
        return magnitude * magnitude * 7500;
    };

    // Create function for marker color based on earthquake depth
    function markerColor(depth)
    {
        if (depth <= 10)
            {return '#ccccff'}
        else if (depth <=30)
            {return '#b199ff'}
        else if (depth <= 50)
            {return '#9770ff'}
        else if (depth <= 70)
            {return '#7d47ff'}
        else if (depth <= 90)
            {return '#631eff'}
        else 
            {return '#4f0099'}
    };

    // Loop through elements in the JSON data
    for(var i = 0; i < data.features.length; i++)
    {
        // Extract the location
        var location = data.features[i].geometry.coordinates;

        markers.push(
            L.circle(
                // Extract the location coordinates
                [location[1], location[0]], 
                {
                    color: "black",
                    weight: 1,
                    // Set the color property based on earthquake depth                        
                    fillColor: markerColor(location[2]),
                    fillOpacity: 0.75,
                    // Set the radius property based on earthquake magnitude
                    radius: markerSize(data.features[i].properties.mag)
                }
            )
            .bindPopup(
            `<center><h1>${data.features[i].properties.place}</h1><hr><h3>Magnitude: ${data.features[i].properties.mag}</h3>
            <h3>Depth: ${location[2]}</h3></center>`
            )
        );

    }
    // Add the cityMarkers to the map using the addLayer method
    var earthquakes = L.layerGroup(markers);
    earthquakes.addTo(myMap)

    // Set up the legend inside of a control L.control()
    let legend = L.control(
        // Set the position using the position property
        {position: "bottomright"}); 
        // Set up the properties of the legend using .onAdd property 
        legend.onAdd = function() {
        // Use L.DomUtil.create() to create the HTML that will go in the index page
        let div = L.DomUtil.create("div", "info legend");
        
        // Define the limits for the segments
        //let limits = ['-10 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '90+'];
        //console.log(limits);
        
        // Define the colors that correspond to the limits for the segments
        let colors = ['#ccccff', '#b199ff', '#9770ff', '#7d47ff', '#631eff', '#4f0099'];
        console.log(colors);
            
        // Add an array for the labels to be added
        let labels = ['-10 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '90+'];
        
        // Add the div code for the minimum and maximum
        var legendInfo = "<h3>Earthquake Depth</h3>" + 
        "<div class = \"labels\">" +
        "<ul>" +
            "<li style=\"background-color:" + colors[0] + "; color:#000000\"> <b>" + labels[0] + "</b></li>" + 
            "<li style=\"background-color:" + colors[1] + "; color:#2B2B2B\"> <b>" + labels[1] + "</b></li>" + 
            "<li style=\"background-color:" + colors[2] + "; color:#474747\"> <b>" + labels[2] + "</b></li>" +
            "<li style=\"background-color:" + colors[3] + "; color:#9B9B9B\"> <b>" + labels[3] + "</b></li>" +
            "<li style=\"background-color:" + colors[4] + "; color:#B8B8B8\"> <b>" + labels[4] + "</b></li>" +
            "<li style=\"background-color:" + colors[5] + "; color:#D3D3D3\"> <b>" + labels[5] + "</b></li>" +
        "</ul>" +
        "</div>";
        
        // Use .innerHTML property to add the legendInfo to the legend
        div.innerHTML = legendInfo;
        
        // Return finalized div
        return div;

        };

    // Add the div to the page
    legend.addTo(myMap);

});