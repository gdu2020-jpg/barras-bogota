import type { Park } from "@/lib/parks";

export interface ParkMapProps {
  parks: Park[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation: { lat: number; lng: number } | null;
  locationAccuracy?: number | null;
  centerOnUserKey?: number;
}
