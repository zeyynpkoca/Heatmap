import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, OverlayView} from '@react-google-maps/api';
import pipelineData from './pipelineData.json';
import jsonData from './marker_data.json';

const containerStyle = {
  width: '900px',
  height: '600px'
};

const initialCenter = {
  lat: 38.795566,
  lng: 26.932540
};
const initialZoom = 16.5; // İlk açılışta kullanılacak yakınlaştırma seviyesi

const mapOptions = {
  mapTypeId: "satellite" // Harita tipi uydu olarak ayarlandı
};
function DynamicHeatmap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCD3JvjrSZOLq_rxUmMeC3UFOK_Mog_jug" // Google Maps API anahtarını buraya ekleyin
  });
  const onMapLoad = React.useCallback(function callback(map) {
    // Harita yüklendikten sonra yapılacak işlemler
    console.log("Harita yüklendi!");
  }, []);
  const onUnmount = React.useCallback(function callback(map) {
    // Harita bileşeni kaldırıldığında yapılacak işlemler
  }, []);

  if (!isLoaded) return <></>;


  // Calculating job count on pipelines
  const systemStatusCounts = {}; // Her MapSectionId için sayaçları depolayacak nesne

  jsonData.forEach(item => {
    pipelineData.forEach(pipe => {
      if (item.MapSectionId === pipe.MapSectionId) {
        if (!systemStatusCounts[pipe.MapSectionId]) {
          systemStatusCounts[pipe.MapSectionId] = 0;
        }
        systemStatusCounts[pipe.MapSectionId]++;
      }
    });
  });

  // We make setup of pipelines using pipeline data(lat lng and name) through heat map
  const markers = pipelineData.map(item => ({
    position: {
      lat: item.Latitude,
      lng: item.Longitude
    },
    name: item.name,
    size: item.Size,
    systemStatusId: item.SystemStatusId,
    mapSectionId: item.MapSectionId

  }));
  const markerOptions = {
    scaledSize: new window.google.maps.Size(40, 40), // Marker boyutunu büyütme
    labelOrigin: new window.google.maps.Point(20, 55), // Label konumu
    labelClass: "custom-label" // Label için özel sınıf
  };
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={initialCenter}
      zoom={initialZoom} // Harita seçeneklerini burada belirtiyoruz
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {markers.map((marker, index) => {
        let markerColor = 'green';

        const systemStatusCount = systemStatusCounts[marker.mapSectionId];
        if (systemStatusCount > 1 &&  systemStatusCount < 5) {
          markerColor = 'yellow';
        } else if (systemStatusCount >= 5) {
          markerColor = 'red';
        }

        return (
          <React.Fragment key={index}>
          <Marker
            key={index}
            position={marker.position}
            label={{
              text: marker.name,
              color: 'rgba(255, 255, 255, 0.9)', // Beyaz renk (hafif şeffaflık)
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' // Hafif gölgeleme efekti
            }}
            
            title={`Size: ${marker.size}`}
            options={{
              icon: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`,
              shadow: {
                anchor: { x: 10, y: 10 }, // Gölgenin konumu
                url: 'https://www.example.com/shadow.png' // Gölge resminin URL'si
              },
              ...markerOptions 
            }}
          />
          <OverlayView
              position={marker.position}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                style={{
                  background: 'white',
                  border: '1px solid #ccc',
                  padding: '3px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {systemStatusCount}
              </div>
            </OverlayView>
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );
}

export default React.memo(DynamicHeatmap);
