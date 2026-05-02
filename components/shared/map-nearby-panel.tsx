"use client";

import { useEffect, useState } from "react";

import { InteractiveNearbyMap } from "@/components/shared/interactive-nearby-map";
import { NearbyPlaces } from "@/components/shared/nearby-places";

type MapNearbyPanelProps = {
  area: string;
  center: {
    lat: number;
    lng: number;
  };
  title: string;
  defaultMapUrl?: string;
  hideNearbyPlaces?: boolean;
};

type NearbyApiItem = {
  name: string;
  address: string;
  distance: string;
  time: string;
  googleMapsUri?: string;
  location?: {
    lat: number;
    lng: number;
  } | null;
};

export function MapNearbyPanel({ area, center, title, defaultMapUrl, hideNearbyPlaces = false }: MapNearbyPanelProps) {
  const [activeTab, setActiveTab] = useState("schools");
  const [items, setItems] = useState<NearbyApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"mock" | "google">("mock");

  useEffect(() => {
    let cancelled = false;

    async function loadNearbyPlaces() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/nearby?area=${encodeURIComponent(area)}&category=${encodeURIComponent(activeTab)}&lat=${encodeURIComponent(String(center.lat))}&lng=${encodeURIComponent(String(center.lng))}`
        );
        const data = (await response.json()) as {
          items?: NearbyApiItem[];
          source?: "mock" | "google";
        };

        if (cancelled) {
          return;
        }

        setItems(data.items ?? []);
        setSource(data.source ?? "mock");
      } catch {
        if (!cancelled) {
          setItems([]);
          setSource("mock");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNearbyPlaces();

    return () => {
      cancelled = true;
    };
  }, [activeTab, area, center.lat, center.lng]);

  return (
    <div className="space-y-6">
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <InteractiveNearbyMap center={center} items={items} title={title} />
      ) : (
        <div className="overflow-hidden rounded-[32px] border border-line">
          <iframe
            title="Nearby map"
            src={
              defaultMapUrl ??
              `https://maps.google.com/maps?q=${encodeURIComponent(`${area}, Hà Nội`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
            }
            className="h-80 w-full"
            loading="lazy"
          />
        </div>
      )}

      {hideNearbyPlaces ? null : (
        <NearbyPlaces
          area={area}
          center={center}
          activeTab={activeTab}
          onCategoryChange={setActiveTab}
          items={items}
          loading={loading}
          source={source}
        />
      )}
    </div>
  );
}
