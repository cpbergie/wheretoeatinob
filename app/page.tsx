"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import restaurantsData from "@/data/restaurants.json";
import { Restaurant } from "@/lib/types";
import RestaurantCard from "@/components/RestaurantCard";
import HappeningNow from "@/components/HappeningNow";
import { isHappyHourNow, isOpenNow } from "@/lib/timeUtils";

const OBMap = dynamic(() => import("@/components/OBMap"), { ssr: false });

const restaurants = restaurantsData as Restaurant[];

export default function Home() {
  const [showAll, setShowAll] = useState(true);
  const [mapFocusId, setMapFocusId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const aHappy = isHappyHourNow(a.happyHour) ? 2 : isOpenNow(a) ? 1 : 0;
    const bHappy = isHappyHourNow(b.happyHour) ? 2 : isOpenNow(b) ? 1 : 0;
    return bHappy - aHappy;
  });

  const displayedRestaurants = showAll
    ? sortedRestaurants
    : sortedRestaurants.filter(r => isOpenNow(r) || isHappyHourNow(r.happyHour));

  const handleMapFocus = (id: string) => {
    setMapFocusId(id);
    document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-sand-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ocean-dark via-ocean to-ocean-light text-white">
        {/* Wave SVG divider top decoration */}
        <div className="px-6 pt-12 pb-6 text-center">
          <h1 className="font-pacifico text-4xl md:text-6xl text-sand-200 drop-shadow-md leading-tight">
            Where to Eat in OB
          </h1>
          <div className="text-4xl mt-2">🌊</div>
          <p className="mt-3 text-sand-100 text-lg md:text-xl max-w-xl mx-auto">
            Happy hours, daily deals, and good vibes in Ocean Beach, San Diego.
          </p>
          <a
            href="#happening-now"
            className="inline-block mt-6 bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3 rounded-full shadow-lg transition-colors text-lg"
          >
            What&apos;s Happening Now 🍺
          </a>
        </div>
        {/* Wave divider */}
        <svg viewBox="0 0 1440 60" className="w-full block -mb-1" preserveAspectRatio="none">
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
            fill="#FDF8EE"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Happening Now Banner */}
        {mounted && (
          <HappeningNow
            restaurants={restaurants}
            showAll={showAll}
            onToggle={() => setShowAll(v => !v)}
          />
        )}

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {displayedRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onMapFocus={handleMapFocus} />
          ))}
          {!showAll && displayedRestaurants.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">😴</div>
              <p className="text-lg font-semibold">Nothing active right now</p>
              <button
                onClick={() => setShowAll(true)}
                className="mt-4 text-ocean underline"
              >
                View all places
              </button>
            </div>
          )}
        </div>

        {/* Map */}
        <div id="map-section" className="mb-12">
          <h2 className="font-pacifico text-2xl text-ocean-dark mb-4">📍 Find &apos;em on the Map</h2>
          <OBMap restaurants={restaurants} focusId={mapFocusId} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ocean-dark text-sand-200 text-center py-6 px-4">
        <p className="font-pacifico text-lg text-sand-300 mb-1">Where to Eat in OB 🤙</p>
        <p className="text-sm text-sand-200/70">Updated weekly by a local · Ocean Beach, San Diego</p>
      </footer>
    </main>
  );
}
