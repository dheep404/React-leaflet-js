import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
//import 'leaflet.fullscreen/Control.FullScreen.css';
//import 'leaflet.fullscreen';
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet.locatecontrol";

import "./App.css";

const { BaseLayer } = LayersControl;

function MapWithDraw() {
  const map = useMap();

  useEffect(() => {
    // Add fullscreen control
    // map.addControl(new L.Control.Fullscreen({
    //   position: "topleft",
    //   title: {
    //     false: "View Fullscreen",
    //     true: "Exit Fullscreen",
    //   },
    // }));

    // Add locate control
    L.control
      .locate({
        position: "topleft",
        strings: {
          title: "Show my location",
        },
        locateOptions: {
          maxZoom: 16,
          enableHighAccuracy: true,
        },
        drawCircle: false,
        drawMarker: true,
        markerStyle: {
          color: "#136AEC",
          fillColor: "#2A93EE",
          fillOpacity: 1,
          weight: 2,
          radius: 6,
        },
        showPopup: false,
      })
      .addTo(map);

    const drawnItems = new L.FeatureGroup().addTo(map);

    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polyline: true,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1e100",
            message: "<strong>Error:</strong> Shape edges cannot cross!",
          },
          shapeOptions: {
            color: "#97009c",
          },
        },
        circle: true,
        rectangle: true,
        marker: true,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    map.on("draw:created", function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      if (layer.getBounds) {
        map.fitBounds(layer.getBounds(), {
          padding: [50, 50],
        });
      } else if (layer.getLatLng) {
        map.setView(layer.getLatLng(), 15);
      }
    });

    map.on("draw:edited", function (event) {
      const layers = event.layers;
      const bounds = L.latLngBounds([]);
      layers.eachLayer(function (layer) {
        if (layer.getBounds) {
          bounds.extend(layer.getBounds());
        } else if (layer.getLatLng) {
          bounds.extend(layer.getLatLng());
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
        });
      }
    });

    map.on("draw:deleted", function () {
      if (drawnItems.getLayers().length === 0) {
        map.setView([52.3555, -1.1743], 7);
      }
    });
  }, [map]);

  return null;
}

function App() {
  return (
    <>
      <MapContainer
        center={[52.3555, -1.1743]}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={7}
        maxZoom={19}
        maxBounds={[
          [49.528423, -10.76418],
          [61.331151, 1.9134116],
        ]}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OSM Standard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="OSM Humanitarian">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Stamen Toner">
            <TileLayer
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.'
              url="https://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Stamen Watercolor">
            <TileLayer
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under ODbL.'
              url="https://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </BaseLayer>
        </LayersControl>
        <MapWithDraw />
      </MapContainer>
    </>
  );
}

export default App;
