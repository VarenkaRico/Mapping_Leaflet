//DATA SET
var queryURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
var faultlinesURL="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

//Query the URL
d3.json(queryURL,function(data){
    createFeatures(data.features); //Call createFeatures Function
});

//EARTHQUAKE PopUp information
//const EarthquakesMarkers= []
function createFeatures (earthquakeData){
    function onEachFeature(feature,layer){
        layer.bindPopup("<h3>"+feature.properties.place + "</h3>"+ //Popup with Place info
        "<hr><p>" + new Date(feature.properties.time)+"</p>"+ //Popup with Date info
        "<p>" + "Magnitude: "+feature.properties.mag + "</p>") //Popup with Magnitude info
    }    
        
//geoJSON layer
    var earthquakes=L.geoJSON(earthquakeData,{

        pointToLayer: function(earthquakeData, latlng) {
            return L.circle(latlng, {
              radius: earthquakeData.properties.mag*70000,
              color: color(earthquakeData.properties.mag),
              fillOpacity: 0.5,
              stroke: false
            });
        },
        onEachFeature:onEachFeature
    });
    createMap(earthquakes); //Call createMap Function

}

function color(magnitude){
    if (magnitude < 2){
        return "#00ff00" //Green
    }
    else if (magnitude <4){
        return "#ffff00" //Yellow
    }
    else if (magnitude <6){
        return "#ff9900" //Orange
    }
    else{
        return "#ff0000" //Red
    }
}

var EarthquakeLayer = L.layerGroup(earthquakes);

//BASE MAP

function createMap(earthquakes){
    var StreetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var SatelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var DarkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var BaseMaps ={
        "Street":StreetMap,
        "Satellite":SatelliteMap,
        "Dark":DarkMap
    };

    var OverlayMaps = {
        "Earthquakes" : earthquakes,
    };


//ALL MAPS

    var myMap = L.map("map",{
    center:[0,0], // Map centered
    zoom:2, //See full world
    layers:[StreetMap,DarkMap,SatelliteMap,earthquakes] 
    });

    L.control.layers(BaseMaps, OverlayMaps,{
        collapsed: false
    }).addTo(myMap);

    //LEGEND

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend"),
            grades = [0, 2, 4, 6],
            labels =[];
        
            div.innerHTML =["<p style='background-color: #ffffff'>LEGEND</p>"]
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background-color:" + color(grades[i]) + "'> " +
            'Magnitudes: ' + grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '</i><br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
};


