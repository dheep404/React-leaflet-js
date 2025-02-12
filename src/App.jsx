import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import Map from "./components/Map";
import "./App.css";
import 'leaflet/dist/leaflet.css';

const { BaseLayer } = LayersControl;

function LayerChangeHandler({ setBgClass }) {
  const map = useMap();

  useEffect(() => {
    const handleLayerChange = (event) => {
      const layerName = event.name;
      console.log(layerName);
      switch (layerName) {
        case 'OS Road':
          setBgClass('os-road-bg');
          break;
        case 'OS Outdoor':
          setBgClass('os-outdoor-bg');
          break;
        case 'OS Light':
          setBgClass('os-light-bg');
          break;
        case 'ESRI Satellite':
          setBgClass('esri-satellite-bg');
          break;
        default:
          setBgClass('');
      }
    };

    map.on('baselayerchange', handleLayerChange);

    return () => {
      map.off('baselayerchange', handleLayerChange);
    };
  }, [map, setBgClass]);

}

LayerChangeHandler.propTypes = {
  setBgClass: PropTypes.func.isRequired,
};

function App() {
  const [bgClass, setBgClass] = useState('os-road-bg');
  const [point] = useState(null);

  useEffect(() => {
    const leafletContainer = document.querySelector('.leaflet-container');
    if (leafletContainer) {
      leafletContainer.classList.remove('os-road-bg', 'os-outdoor-bg', 'os-light-bg', 'esri-satellite-bg');
      leafletContainer.classList.add(bgClass);
    }
  }, [bgClass]);

  return (
    <>
      <p>React Leaflet Map</p>
      <MapContainer
        center={[52.3555, -1.1743]}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={7}
        maxZoom={16}
        maxBoundsViscosity={1.0}
        maxBounds={[
          [49.528423, -10.76418],
          [61.331151, 1.9134116],
        ]}
      >
        <LayersControl position="bottomleft">
          <BaseLayer checked name="OS Road">
            <TileLayer
              attribution='&copy; <a href="https://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
              url="https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=feaQfyQT74mqgK8IVRV4wRocSYvmVFMk"
            />
          </BaseLayer>
          <BaseLayer name="OS Outdoor">
            <TileLayer
              attribution='&copy; <a href="https://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
              url="https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=feaQfyQT74mqgK8IVRV4wRocSYvmVFMk"
            />
          </BaseLayer>
          <BaseLayer name="OS Light">
            <TileLayer
              attribution='&copy; <a href="https://www.ordnancesurvey.co.uk/">Ordnance Survey</a>'
              url="https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=feaQfyQT74mqgK8IVRV4wRocSYvmVFMk"
            />
          </BaseLayer>
          <BaseLayer name="ESRI Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </BaseLayer>
        </LayersControl>
        <LayerChangeHandler setBgClass={setBgClass} />
        <Map addPoint={point} />
      </MapContainer>
    </>
  );
}

export default App;