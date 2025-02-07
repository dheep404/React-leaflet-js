import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { useState } from "react";
import Map from "./components/Map";
import "./App.css";
import 'leaflet/dist/leaflet.css';

const { BaseLayer } = LayersControl;

function App() {
  const [point] = useState(null);

  return (
    <>
      <p>React Leaflet Map</p>
      <MapContainer
        center={[52.3555, -1.1743]}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={1}
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
          <BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </BaseLayer>
        </LayersControl>
        <Map addPoint={point} />
      </MapContainer>
    </>
  );
}

export default App;
