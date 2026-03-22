"use client";

import { useEffect, useRef } from "react";
import { Restaurant } from "@/lib/types";

interface Props {
  restaurants: Restaurant[];
  focusId: string | null;
}

export default function OBMap({ restaurants, focusId }: Props) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon path
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [32.7469, -117.2515],
        zoom: 15,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const waveIcon = L.divIcon({
        html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.4))">🌮</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      restaurants.forEach((r) => {
        const marker = L.marker(r.coords, { icon: waveIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;">
              <strong style="color:#1B6CA8">${r.name}</strong><br/>
              <small>${r.address}</small><br/>
              ${r.happyHour ? `<span style="color:#FF6B6B;font-size:12px">🍺 Happy Hour ${r.happyHour.start.replace(":",".")} - ${r.happyHour.end.replace(":",".")}</span>` : ""}
              <br/><a href="#card-${r.id}" style="color:#2E86AB;font-size:12px">View details ↓</a>
            </div>`
          );
        markersRef.current[r.id] = marker;
      });

      mapRef.current = map;
    });
  }, [restaurants]);

  useEffect(() => {
    if (!focusId || !mapRef.current) return;
    import("leaflet").then(() => {
      const marker = markersRef.current[focusId];
      if (marker) {
        mapRef.current.setView(marker.getLatLng(), 16, { animate: true });
        marker.openPopup();
      }
    });
  }, [focusId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-md z-10"
    />
  );
}
