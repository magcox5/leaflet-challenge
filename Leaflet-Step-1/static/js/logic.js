// Store our API endpoint inside queryUrl -- Earthquakes >= 4.5 in past week
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var legendTitle = "Earthquakes Last week"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    // console.log(feature.properties.place, feature.properties.mag, feature.properties.time);
    // Add circles to each earthquake feature
    layer.bindPopup("<h3>" + feature.properties.place + "<hr>magnitude: " + feature.properties.mag + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  };

  // Set default geojsonMarker Options
  var geojsonMarkerOptions = {
    radius: 5,
    fillColor: "yellow",
    color: "white",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.75    
    };

    // Set fill color of circle based on magnitude
    function getFillColor (mag) {

        if (mag > 5) {
            return "Brown";
        } else if (mag > 4) {
            return "Red";
        } else if (mag > 3) {
            return "Orange";
        } else if (mag > 2) {
            return "Yellow";
        } else {
            return "Green";
        };
    };

    // Multiply magnitude by 3 for radius size of circle
    function set_styling(feature) {
        return {
            radius: feature.properties.mag * 3,
            fillColor: getFillColor(feature.properties.mag)
        };

    };

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // To add circles to each earthquake feature
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    style: set_styling
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and satellitemap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Create a legend for map colors and title
// > 5 = Brown, 4-5 = Red, 3-4 = Orange, 2-3 = Yellow, < 2 = Green 
var legend = L.control({position: "bottomleft" });
legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += `<h4>${legendTitle}</h4>`;
  div.innerHTML += '<i style="background: Brown">&nbsp&nbsp&nbsp;</i><span> 5 and up </span><br>';
  div.innerHTML += '<i style="background: Red">&nbsp&nbsp&nbsp;</i><span> 4 to 5</span><br>';
  div.innerHTML += '<i style="background: Orange">&nbsp&nbsp&nbsp;</i><span> 3 to 4</span><br>';
  div.innerHTML += '<i style="background: Yellow">&nbsp&nbsp&nbsp;</i><span> 2 to 3</span><br>';
  div.innerHTML += '<i style="background: Green">&nbsp&nbsp&nbsp;</i><span> less than 2</span><br>';
  return div;
};

legend.addTo(myMap);




}
