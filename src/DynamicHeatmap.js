import React from 'react'
import { GoogleMap, useJsApiLoader,Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '900px',
  height: '600px'
};

const center = {
  lat: 38.789414, 
  lng: 26.945628
};

function DynamicHeatmap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCD3JvjrSZOLq_rxUmMeC3UFOK_Mog_jug"
  })

  const [map, setMap] = React.useState(null)

  

//   const onLoad = React.useCallback(function callback(map) {
//     // This is just an example of getting and using the map instance!!! don't just blindly copy!
//     const bounds = new window.google.maps.LatLngBounds(center);
//     map.fitBounds(bounds);

//     setMap(map)
//   }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        // onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
      position={{ lat: 38.789414, lng: 26.945628 }} // Marker'ın konumu
      // Diğer özellikleri burada belirtebilirsiniz
    />
      </GoogleMap>
  ) : <></>
}

export default React.memo(DynamicHeatmap)