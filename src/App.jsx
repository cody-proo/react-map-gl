import React, { useEffect, useState } from "react";
import ReactMapGL, {
  Marker,
  NavigationControl,
  setRTLTextPlugin,
} from "react-map-gl";
import { BsFillGeoAltFill } from "react-icons/bs";

setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  null,
  true
);

const App = () => {
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedLatLon, setSelectedLatLon] = useState();
  const [viewport, setViewport] = useState({
    zoom: 15,
    height: "100vh",
    width: "100%",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
      setViewport((prevViewport) => ({
        ...prevViewport,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      }));
    });
  }, []);

  const onChangeViewport = (newViewportState) => setViewport(newViewportState);

  const onSelectViewport = (event) => {
    const [lng, lat] = event.lngLat;
    setSelectedLatLon({ longitude: lng, latitude: lat });
  };

  return (
    <div style={{ direction: "rtl" }}>
      <ReactMapGL
        {...viewport}
        attributionControl={false}
        onViewportChange={onChangeViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v10"
        onClick={onSelectViewport}
      >
        {typeof currentLocation !== typeof undefined && (
          <Marker
            latitude={
              typeof selectedLatLon === typeof undefined &&
              typeof currentLocation !== typeof undefined
                ? currentLocation.latitude
                : selectedLatLon.latitude
            }
            longitude={
              typeof selectedLatLon === typeof undefined &&
              typeof currentLocation !== typeof undefined
                ? currentLocation.longitude
                : selectedLatLon.longitude
            }
            offsetLeft={-20}
            offsetTop={-10}
          >
            <BsFillGeoAltFill color="#000" />
          </Marker>
        )}
        <NavigationControl
          className="navigation__control"
          showZoom
          showCompass={false}
        />
      </ReactMapGL>
      <button
        onClick={() => {
          setSelectedLatLon(undefined);
          setViewport((prevViewport) => ({
            ...prevViewport,
            longitude: currentLocation.longitude,
            latitude: currentLocation.latitude,
          }));
        }}
        className="reset__button"
      >
        reset
      </button>
    </div>
  );
};

export default App;
