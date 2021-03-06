import React, { useRef, useEffect, useState } from "react";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import "../styles/screens/MapScreen.css";

import axios from "axios";

import GeoJSON from "geojson";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVyYWNsZXMtMTIiLCJhIjoiY2txcndlNGtpMDVsbDJ2cnYzbjlnMG5iZSJ9.4gvbkQ9Sb5BgkD_WgbIW5Q";

const MapScreen = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-93.7200);
  const [lat, setLat] = useState(29.3265);
  const [zoom, setZoom] = useState(2.85);

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });

  useEffect(async () => {
    if (map.current) return; // initialize map only once
    const response = await axios.get(`/api/products/map_info/`);
    const result = response.data;
    const locations = GeoJSON.parse(result, { Point: ["lat", "lon"] });
    console.log(locations.features[0].properties._id);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(geocoder);

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("load", function () {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.current.addSource("cities", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ cities
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: locations,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "cities",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "cities",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "cities",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
      // inspect a cluster on click
      map.current.on("click", "clusters", function (e) {
        var features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties._id;
        map.current
          .getSource("cities")
          .getClusterExpansionZoom(clusterId, function (err) {
            if (err) return;

            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: 5,
            });
          });
      });

      map.current.on("click", "unclustered-point", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.address;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map.current);
      });

      map.current.on("mouseenter", "clusters", function () {
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", function () {
        map.current.getCanvas().style.cursor = "";
      });

      map.current.on("mouseenter", "unclustered-point", function () {
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "unclustered-point", function () {
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, []);

  return (
    <div className="map-screen">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default MapScreen;
