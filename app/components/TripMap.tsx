'use client'

import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<L.Map | null>(null); //this ref can be either L.Map or null
  const center = { lng: 13.338414, lat: 52.507932 };
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new L.Map(mapContainer.current!, {
      center: L.latLng(center.lat, center.lng),
      zoom: zoom
    });

    // Create a MapTiler Layer inside Leaflet
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.current);

  }, [center.lng, center.lat, zoom]);

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }}/>
    </div>
  )
}

export default Map;