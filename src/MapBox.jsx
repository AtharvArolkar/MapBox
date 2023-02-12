import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

// import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "./Map.css";
import AddMark from "./AddMarkerPopUp";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXRoYXJ2MjQxMCIsImEiOiJjbGR5OWxpeGswb2wwM3Budmw0dGpkMjU0In0.nwambBl8oLAnr69ftH9aDQ";

export default function MapBox() {
  var mapboxgl = require("mapbox-gl");
  const [styleOfMap, setStyle] =useState("mapbox://styles/mapbox/streets-v12")
  const [lng, setLng] = useState(-0.118092);
  const [lat, setLat] = useState(51.509865);
  const [zoom, setZoom] = useState(12);
  const [map,setMaps]= useState();
  const initMaps = async (mapStyle) => {
    setStyle(mapStyle);
    const map = await new mapboxgl.Map({
      container: "map",
      style: mapStyle,
      // style: "mapbox://styles/mapbox/satellite-streets-v12",
      // style: "mapbox://styles/mapbox/dark-v11",
      // style: "mapbox://styles/mapbox/outdoors-v12",
      center: [lng, lat],
      zoom: 10.5,
    });
    setMaps(map);

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.FullscreenControl());

    //Adds Search Feature
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        zoom: 12,
      })
    );

    // Adds direction feature
    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        // closeButton: true
      }),
      "bottom-left"
    );

    map.on("load", () => {
      map.addSource("places", {
        //GEOJSON DATA
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
                type: "not-visited",
                phone: "123-888-7890",
                address: "433 Main St",
                email: "atharv_arolkar@persistent.com",
              },
              geometry: {
                type: "Point",
                coordinates: [-0.33782, 51.583015],
              },
            }, //top-left
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>",
                type: "visited",
                phone: "000-456-7890",
                address: "198 Main St",
                email: "atharv_arolkar@persistent.com",
              },
              geometry: {
                type: "Point",
                coordinates: [-0.118092, 51.509865],
              }, //center
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a Big Backyard Beach Bash and Wine Fest on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.</p>",
                type: "visited",
                phone: "777-456-7890",
                address: "232 Main St",
                email: "atharv_arolkar@persistent.com",
              },
              geometry: {
                type: "Point",
                coordinates: [0.0724, 51.5596],
              },
            }, //top-right
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Ballston Arts & Crafts Market</strong><p>The Ballston Arts & Crafts Market sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>",
                type: "not-visited",
                phone: "723-456-7890",
                address: "423 Main St",
                email: "atharv_arolkar@persistent.com",
              },
              geometry: {
                type: "Point",
                coordinates: [-0.001545, 51.477928],
              },
            }, //bottom-right
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's Seersucker Social bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>",
                type: "visited",
                phone: "123-456-7890",
                address: "123 Main St",
                email: "atharv_arolkar@persistent.com",
              },
              geometry: {
                type: "Point",
                coordinates: [-0.214443, 51.433727],
              },
            }, //bottom-left
          ],
        },
      });

      //ITERATED THROUGH THE GEOJSON DATA AND ADDS MARKERS. COLOR OF MARKER BASED IN COLOR PROPERTY
      //ADDS OTHER DATA LIKE EMAIL, DESCRIPTION,PHONE,ADDRESS WHICH IS VISIBLE ON-CLICKING THE MARKER
      map.getSource("places")._data.features.forEach((feature) => {
        // console.log(feature.properties.type)
        const marker = new mapboxgl.Marker({
          color:
            feature.properties.type === "visited"
              ? "green"
              : feature.properties.type === "not-visited"
              ? "red"
              :feature.properties.type === "current"
              ? "blue"
              : "black",
          draggable: true,
        })
          .setLngLat(feature.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p>${feature.properties.description}</p>
              <p>Phone: <a href="tel:${feature.properties.phone}"> ${feature.properties.phone}</a></p>
              <p>Address: ${feature.properties.address}</p>
              <p> Email: <a href="mailto:atharv_arolkar@persistent.com">${feature.properties.email}</a></p>`
            )
          )
          .addTo(map);
      });

      //ADDS NEW MARKERS BY RIGHT CLICKING ON THE MAP AND APPENDS THE NEW DATA TO GEOJSON DATA
      map.on("contextmenu", (event) => {
        let marker = new mapboxgl.Marker({
          color: "red",
          draggable: true,
        })
          .setLngLat(event.lngLat)
          .addTo(map);
        let properties = {
          description: "This is a not-visted marker",
        };

        // add the marker properties to the geojson data
        let newFeature = {
          type: "Feature",
          properties: properties,
          geometry: {
            type: "Point",
            coordinates: [event.lngLat.lng, event.lngLat.lat],
          },
        };

        let source = map.getSource("places");
        let features = source._data.features;
        features.push(newFeature);
        source.setData({ type: "FeatureCollection", features: features });
        console.log(source._data.features);
      });
    });

    // Clean up on unmount
    return () => map.remove();
  };

 
  useEffect(() => {
    window.addEventListener("load", initMaps("mapbox://styles/mapbox/streets-v12"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //ONCLICK GETS CURRENT LOCATION AND RECENTERS THE MAP TO THE CURRENT LOCATION
  const handleLocateCurrent = () => {
    // const map = new mapboxgl.Map({
    //   container: "map",
    //   style: styleOfMap,
    //   zoom: 15,
    // });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        
        var longitude = position.coords.longitude;
        
        
        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          speed: 1.2,
          easing(t) {
            return t;
          },
        });
        var marker = new mapboxgl.Marker({
          color: "blue",
        })
          .setLngLat([longitude, latitude])
          .addTo(map);

          let properties = {
            description: "This is a current marker",
            type: "current",
          };
  
          // add the marker properties to the geojson data
          let newFeature = {
            type: "Feature",
            properties: properties,
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          };
  
          let source = map.getSource("places");
          console.log(source);
          let features = source._data.features;
          features.push(newFeature);
          source.setData({ type: "FeatureCollection", features: features });
          console.log(source._data.features);

        setLng(longitude);
        setLat(latitude);
        console.log(latitude + "-" + longitude);
        // map.setCenter([longitude, latitude]);
        console.log(lat+" "+lng)
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const onChangeMapStyle = (event) =>{
    
    initMaps(event.target.value);
    console.log(event.target.value+" "+lat+" "+lng)
  }

  //HTML ELEMENTS
  return (
    <div>
      <div className="sidebarStyle">
        {/* <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div> */}

        <button className="buttonSide" onClick={handleLocateCurrent}>
          <i className="fa fa-crosshairs fa_custom fa-3x"></i>
        </button>
        <div>
        <select onChange={onChangeMapStyle}>
        // style: "mapbox://styles/mapbox/satellite-streets-v12",
      // style: "mapbox://styles/mapbox/dark-v11",
      // style: "mapbox://styles/mapbox/outdoors-v12",
          <option value="mapbox://styles/mapbox/streets-v12">Streets</option>
          <option value="mapbox://styles/mapbox/outdoors-v12">Outdoors</option>
          <option value="mapbox://styles/mapbox/light-v11">Light</option>
          <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
          <option value="mapbox://styles/mapbox/satellite-streets-v12">Satellite</option>
        </select>
        {/* <Map style={this.state.mapStyle} /> */}
      </div>
      </div>
      <div id="map"></div>
    </div>
  );
}
