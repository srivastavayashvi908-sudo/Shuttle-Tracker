import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import type { BusLocation } from "@/types/types";

// Leaflet's default icon paths break under bundlers; point them at the CDN.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// VIT Vellore campus, used when the student's GPS is unavailable.
const CAMPUS: [number, number] = [12.9692, 79.1559];

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [map, lat, lng]);
  return null;
}

export default function LiveMap({ buses }: { buses: BusLocation[] }) {
  const [me, setMe] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMe([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("GPS error:", err)
    );
  }, []);

  const center: [number, number] = buses.length
    ? [buses[0].latitude, buses[0].longitude]
    : me ?? CAMPUS;

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <Recenter lat={center[0]} lng={center[1]} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {me && (
        <Marker position={me}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      {buses.map((bus) => (
        <Marker key={bus.busId} position={[bus.latitude, bus.longitude]}>
          <Popup>
            {bus.busId} ({bus.route})
            <br />
            Driver: {bus.driverName || "unknown"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
