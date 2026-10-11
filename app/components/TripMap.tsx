'use client'

import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface ActivityWithId {
  id: number;
  time: string;
  description: string;
  lat: number;
  lng: number;
  dayNumber: number;
}

interface MapProps {
  activities: ActivityWithId[];
}

const Map = ({ activities }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return;
    if (activities.length === 0) return;

    // center na první aktivitu
    const firstActivity = activities[0];

    map.current = new L.Map(mapContainer.current!, {
      center: L.latLng(firstActivity.lat, firstActivity.lng),
      zoom: zoom
    });

    setTimeout(()=>{
      map.current?.invalidateSize();
    },100);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.current);

    // numbered markers
    activities.forEach((activity) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background: #facc15;
          border: 1px solid #d97706;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: black;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${activity.id}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([activity.lat, activity.lng], { icon })
        .addTo(map.current!)
        .bindPopup(`
          <strong>Day ${activity.dayNumber} • ${activity.time}</strong><br/>
          ${activity.description}
        `);
    });

  }, [activities, zoom]);

  return (
    <div style={{ width: '100%', height: '250px'}}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '5%', border:' 2px solid #facc15' }} />
    </div>
  )
}

export default Map;