import { useEffect, useRef } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { BOGOTA_CENTER } from "@/lib/geo";
import type { ParkMapProps } from "@/lib/map-types";
import type { Park } from "@/lib/parks";
import "leaflet/dist/leaflet.css";

function MapEffects({
  parks,
  selected,
  userLocation,
  centerOnUserKey,
}: {
  parks: Park[];
  selected: Park | undefined;
  userLocation: { lat: number; lng: number } | null;
  centerOnUserKey?: number;
}) {
  const map = useMap();
  const lastUserCenterKey = useRef(0);
  const key = parks.map((p) => p.id).join(",");

  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 14, { duration: 0.65 });
    }
  }, [selected, map]);

  useEffect(() => {
    if (selected || parks.length === 0) return;
    if (userLocation) return;
    if (parks.length === 1) {
      map.flyTo([parks[0].lat, parks[0].lng], 13, { duration: 0.6 });
      return;
    }
    const bounds = parks.map((p) => [p.lat, p.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
  }, [key, selected, userLocation, map, parks]);

  useEffect(() => {
    if (
      userLocation &&
      centerOnUserKey &&
      centerOnUserKey !== lastUserCenterKey.current
    ) {
      lastUserCenterKey.current = centerOnUserKey;
      const distanceFromCenter = map
        .getCenter()
        .distanceTo([userLocation.lat, userLocation.lng]);
      if (distanceFromCenter > 10 || map.getZoom() < 13) {
        map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 0.6 });
      }
    }
  }, [centerOnUserKey, map, userLocation]);

  return null;
}

export function ParkMapInner({
  parks,
  selectedId,
  onSelect,
  userLocation,
  locationAccuracy,
  centerOnUserKey,
}: ParkMapProps) {
  const selected = parks.find((p) => p.id === selectedId);

  return (
    <MapContainer
      center={[BOGOTA_CENTER.lat, BOGOTA_CENTER.lng]}
      zoom={12}
      scrollWheelZoom
      className="h-full min-h-96 w-full"
      maxBounds={[
        [-4.3, -79.2],
        [13.6, -66.7],
      ]}
      minZoom={5}
      maxZoom={17}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapEffects
        parks={parks}
        selected={selected}
        userLocation={userLocation}
        centerOnUserKey={centerOnUserKey}
      />
      {userLocation && locationAccuracy != null && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={locationAccuracy}
          pathOptions={{
            color: "#c9d0c4",
            fillColor: "#c9d0c4",
            fillOpacity: 0.08,
            weight: 1,
          }}
        />
      )}
      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={7}
          pathOptions={{
            color: "#ecece4",
            fillColor: "#ecece4",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Tooltip>Estás aquí</Tooltip>
        </CircleMarker>
      )}
      {parks.map((park) => {
        const active = park.id === selectedId;
        return (
          <CircleMarker
            key={park.id}
            center={[park.lat, park.lng]}
            radius={active ? 11 : 7}
            pathOptions={{
              color: active ? "#c9d0c4" : "#7d9a78",
              fillColor: active ? "#c9d0c4" : "#7d9a78",
              fillOpacity: active ? 1 : 0.75,
              weight: active ? 3 : 1,
            }}
            eventHandlers={{
              click: () => onSelect(park.id),
            }}
          >
            <Tooltip>
              {park.shortName} · {park.score.toFixed(1)}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
