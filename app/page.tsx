"use client";

import { useState, useEffect } from "react";
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
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const aScore = isHappyHourNow(a.happyHour) ? 2 : isOpenNow(a) ? 1 : 0;
    const bScore = isHappyHourNow(b.happyHour) ? 2 : isOpenNow(b) ? 1 : 0;
    return bScore - aScore;
  });

  const displayedRestaurants = showAll
    ? sortedRestaurants
    : sortedRestaurants.filter(r => isOpenNow(r) || isHappyHourNow(r.happyHour));

  const handleMapFocus = (id: string) => {
    setMapFocusId(id);
    document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ backgroundColor: "#071f33", minHeight: "100vh", color: "#fff" }}>

      {/* Hero Banner with OB Jetty photo */}
      <div style={{ position: "relative", height: "380px", overflow: "hidden" }}>
        <img
          src="/hero.webp"
          alt="Ocean Beach San Diego"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(7,31,51,0.3) 0%, rgba(7,31,51,0.75) 100%)" }} />
        {/* Hero text */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 1rem" }}>
          <h1 style={{ fontFamily: "var(--font-righteous)", fontSize: "clamp(2.2rem, 7vw, 4rem)", color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.6)", lineHeight: 1.1, margin: 0 }}>
            Where to Eat in OB
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#c8e6f5", fontSize: "clamp(1rem, 3vw, 1.25rem)", textShadow: "0 1px 6px rgba(0,0,0,0.5)", maxWidth: "520px" }}>
            Happy hours, daily deals, and good vibes in Ocean Beach, San Diego.
          </p>
          <a
            href="#happening-now"
            style={{ marginTop: "1.25rem", backgroundColor: "#FF6B6B", color: "#fff", fontWeight: 700, padding: "0.65rem 2rem", borderRadius: "999px", textDecoration: "none", fontSize: "1.05rem", boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}
          >
            What&apos;s Happening Now 🍺
          </a>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Happening Now */}
        <div id="happening-now" style={{ marginBottom: "2rem" }}>
          {mounted && (
            <HappeningNow
              restaurants={restaurants}
              showAll={showAll}
              onToggle={() => setShowAll(v => !v)}
              tick={tick}
            />
          )}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {displayedRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onMapFocus={handleMapFocus} />
          ))}
          {!showAll && displayedRestaurants.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#8bb8d4" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>😴</div>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Nothing active right now</p>
              <button onClick={() => setShowAll(true)} style={{ marginTop: "1rem", color: "#4ECDC4", background: "none", border: "none", textDecoration: "underline", cursor: "pointer", fontSize: "1rem" }}>
                View all places
              </button>
            </div>
          )}
        </div>

        {/* Map */}
        <div id="map-section" style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--font-righteous)", fontSize: "1.6rem", color: "#c8e6f5", marginBottom: "1rem" }}>📍 Find &apos;em on the Map</h2>
          <OBMap restaurants={restaurants} focusId={mapFocusId} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#040f1a", color: "#8bb8d4", textAlign: "center", padding: "1.5rem 1rem" }}>
        <p style={{ fontFamily: "var(--font-righteous)", fontSize: "1.1rem", color: "#c8e6f5", marginBottom: "0.25rem" }}>Where to Eat in OB 🤙</p>
        <p style={{ fontSize: "0.85rem" }}>Updated weekly by a local · Ocean Beach, San Diego</p>
      </footer>
    </main>
  );
}
