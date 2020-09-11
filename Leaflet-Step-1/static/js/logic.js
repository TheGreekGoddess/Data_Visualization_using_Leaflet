// Start by storing our API endpoint as URL constants
const earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define and initialize the layer groups for earthquakes and tectonic plates
const earthquakes = new L.LayerGroup();

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define the various basemaps available on Mapbox.com with a placeholder for the API Key needed to access these
const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
});

const lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
});

const outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
});

const streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 524,
    maxZoom: 19,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define a baseMaps object that will hold the various layers defined above
const baseMaps = {
    "Dark Mode": darkMap,
    "Light Mode": lightMap,
    "Outdoor Mode": outdoorMap,
    "Satellite Mode": satelliteMap,
    "Street Mode": streetMap
};

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define an overlayMaps object to hold our overlay layers for earthquakes and tectonic plates
const overlayMaps = {
    "Earthquakes": earthquakes,
};

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define a map object and set the default mode, latitude and longitude
const myMap = L.map("map", {
    center: [35.30, -92.00],
    zoom: 5,
    layers: [lightMap, earthquakes]
});

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Define a layer control to pass in baseMaps and overlayMaps as well as add the layer control to the displayed map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=

// Grab data from the USGS Earthquakes GeoJSON data using D3
d3.json(earthquakesURL, function(earthquakeData) {

    //  Define a function that will adjust the marker size based on the magnitude of the corresponding earthquake
    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 2.9;
    }

    // Define a function that will adjust the marker style based on the magnitude of the corresponding earthquake
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: chooseColor(feature.properties.mag),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.4
        };
    }
    
    // Define a function that will determine the marker color based on the magnitude of the corresponding earthquake
    function chooseColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#B32525";
        case magnitude > 4:
            return "#EF6060";
        case magnitude > 3:
            return "#EE8E21";
        case magnitude > 2:
            return "#FFE571";
        case magnitude > 1:
            return "#A7D177";
        default:
            return "#96D5D4";
        }
    }

    // Define a GeoJSON layer containing the earthquake data object and features
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        
        // Define a function that runs once per feature and displays a pop-up containing the location, time and magnitude of the Earthquake
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4> Earthquake Location: " + feature.properties.place + "</h4> <hr> <p> Earthquake Date & Time: " + new Date(feature.properties.time) + "</p> <hr> <p> Earthquake Magnitude: " + feature.properties.mag + "</p>");
        }

    // Add the earthquake data to earthquakes layer group
    }).addTo(earthquakes);

    // Add the earthquake layer to the displayed map
    earthquakes.addTo(myMap);

    // Define and add the legend to the map
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3> Earthquake Magnitude </h3> <hr>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? " to " + magnitudeLevels[i + 1] + '<br>' : ' and above');
        }
        return div;
    };

    // Add the legend to the displayed map
    legend.addTo(myMap);
});

// =-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=