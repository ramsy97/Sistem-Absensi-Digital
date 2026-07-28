"use client";
import React, { useState, useEffect } from "react";

interface LocationMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
  officeName?: string;
}

export default function LocationMap({ onLocationChange, officeName }: LocationMapProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setVerified(true);
        onLocationChange?.(loc.lat, loc.lng);
      },
      () => {
        setError("Could not get location. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onLocationChange]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="h-48 relative bg-surface-container">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-sm">map</span>
            <p className="text-body-sm text-on-surface-variant">
              {location
                ? `${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E`
                : error || "Detecting location..."}
            </p>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`bg-white/95 backdrop-blur shadow-lg rounded-lg p-3 flex items-center gap-3 border ${verified ? "border-green-200" : "border-outline-variant"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${verified ? "bg-[#D1FAE5] text-[#065F46]" : "bg-surface-container text-on-surface-variant"}`}>
              <span className="material-symbols-outlined fill-icon">location_on</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps" style={{ color: verified ? "#065F46" : undefined }}>
                {verified ? "LOCATION VERIFIED" : "DETECTING..."}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface">
                {verified ? "GPS signal acquired" : error || "Please enable location services"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {officeName && (
        <div className="p-4 border-t border-outline-variant flex items-center gap-2 bg-surface-bright">
          <span className="material-symbols-outlined text-primary text-sm">apartment</span>
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">{officeName}</span>
        </div>
      )}
    </div>
  );
}
