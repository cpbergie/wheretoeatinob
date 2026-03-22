"use client";

import { Restaurant } from "@/lib/types";
import { isHappyHourNow, isOpenNow, formatCurrentTime } from "@/lib/timeUtils";

interface Props {
  restaurants: Restaurant[];
  showAll: boolean;
  onToggle: () => void;
  tick: number;
}

export default function HappeningNow({ restaurants, showAll, onToggle, tick: _tick }: Props) {
  const timeStr = formatCurrentTime();
  const happyCount = restaurants.filter(r => isHappyHourNow(r.happyHour)).length;
  const openCount = restaurants.filter(r => isOpenNow(r)).length;

  return (
    <div id="happening-now" style={{
      backgroundColor: "#0e3d61",
      border: "1px solid #1e5f8a",
      borderRadius: "16px",
      padding: "1.25rem 1.5rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <p style={{ color: "#8bb8d4", fontSize: "0.85rem", marginBottom: "0.25rem" }}>🕐 {timeStr}</p>
          {happyCount > 0 ? (
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", margin: 0 }}>
              🍻 <span style={{ color: "#5BC8E8" }}>{happyCount} {happyCount === 1 ? "spot has" : "spots have"}</span> happy hour right now!
            </p>
          ) : (
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#c8e6f5", margin: 0 }}>No happy hours active right now</p>
          )}
          <p style={{ color: "#8bb8d4", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            {openCount} of {restaurants.length} places currently open
          </p>
        </div>
        <button
          onClick={onToggle}
          style={{
            backgroundColor: "#5BC8E8",
            color: "#fff",
            fontWeight: 700,
            padding: "0.5rem 1.25rem",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
            whiteSpace: "nowrap"
          }}
        >
          {showAll ? "Show Active Only" : "View All Places"}
        </button>
      </div>
    </div>
  );
}
