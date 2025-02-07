import { useEffect } from "react";
import { useMap } from "react-leaflet";
import PropTypes from 'prop-types';
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet.locatecontrol/dist/L.Control.Locate.css";
import "leaflet.locatecontrol";

//random lat long coordinates for england
const randomLatLng = () => {
  const lat = 49.528423 + Math.random() * (61.331151 - 49.528423);
  const lng = -10.76418 + Math.random() * (1.9134116 + 10.76418);
  return [lat, lng];
};

function Map({ addPoint }) {
  const map = useMap();

  useEffect(() => {
    // Add locate control part
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
        showPopup: true,
      })
      .addTo(map);

    const drawnItems = new L.FeatureGroup().addTo(map);
    
    // add draw controls 
    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polyline: true,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1e100",
            message: "<p>Error: Shape edges cannot cross!<p>",
          },
          shapeOptions: {
            color: "#97009c",
          },
        },
        circle: true,
        rectangle: true,
        marker: true,
        circlemarker: true,
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

    if (addPoint) {
      const point = L.marker(addPoint).addTo(map);
      drawnItems.addLayer(point);
      map.setView(addPoint, 15);
    }

    // Add jump to location button
    const customControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      onAdd: function () {
        const container = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.innerHTML = 'Jump to random location';
        container.style.backgroundColor = 'white';
        container.style.width = 'auto';
        container.style.height = '30px';
        container.style.cursor = 'pointer';

        container.onclick = function () {
          const point = randomLatLng();
          const marker = L.marker(point).addTo(map);
          drawnItems.addLayer(marker);
          map.setView(point, 10);
        };

        return container;
      }
    });

    map.addControl(new customControl());

  }, [map, addPoint]);
  return null;
}

Map.propTypes = {
  addPoint: PropTypes.arrayOf(PropTypes.number),
};

export default Map;
