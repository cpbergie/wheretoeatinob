"use client";

import { useEffect, useState } from "react";
import { Restaurant } from "@/lib/types";
import {
  isOpenNow, isHappyHourNow, formatTime, getTodaySpecials,
  getCurrentDayKey, DAY_LABELS
} from "@/lib/timeUtils";

interface Props {
  restaurant: Restaurant;
  onMapFocus?: (id: string) => void;
}

export default function RestaurantCard({ restaurant: r, onMapFocus }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [happyHour, setHappyHour] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(isOpenNow(r));
    setHappyHour(isHappyHourNow(r.happyHour));
    const interval = setInterval(() => {
      setOpen(isOpenNow(r));
      setHappyHour(isHappyHourNow(r.happyHour));
    }, 60000);
    return () => clearInterval(interval);
  }, [r]);

  const todayKey = getCurrentDayKey();
  const todayHours = r.hours[todayKey];
  const todaySpecials = getTodaySpecials(r);

  const borderColor = mounted && happyHour ? "#FF6B6B" : mounted && open ? "#2E86AB" : "#1e3a52";
  const headerBg = mounted && happyHour ? "rgba(255,107,107,0.08)" : "transparent";

  return (
    <div
      id={`card-${r.id}`}
      style={{
        backgroundColor: "#0e2d45",
        borderRadius: "16px",
        border: `2px solid ${borderColor}`,
        overflow: "hidden",
        transition: "border-color 0.3s"
      }}
    >
      {/* Header */}
      <div style={{ padding: "1.25rem 1.25rem 0.75rem", backgroundColor: headerBg }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-righteous)", fontSize: "1.2rem", color: "#4ECDC4", textDecoration: "none" }}
            >
              {r.name}
            </a>
            <p style={{ color: "#8bb8d4", fontSize: "0.82rem", marginTop: "0.2rem" }}>{r.address}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-end", flexShrink: 0 }}>
            {mounted && happyHour && (
              <span style={{ backgroundColor: "#FF6B6B", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                🍺 HAPPY HOUR
              </span>
            )}
            {mounted && open && !happyHour && (
              <span style={{ backgroundColor: "#2E86AB", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                ✅ OPEN
              </span>
            )}
            {mounted && !open && (
              <span style={{ backgroundColor: "#1a3348", color: "#6a8fa8", fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                CLOSED
              </span>
            )}
          </div>
        </div>

        {/* Today's hours */}
        <p style={{ color: "#8bb8d4", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          <strong style={{ color: "#c8e6f5" }}>{DAY_LABELS[todayKey]}:</strong>{" "}
          {todayHours ? `${formatTime(todayHours.open)} – ${formatTime(todayHours.close)}` : "Hours not listed"}
        </p>
      </div>

      {/* Happy Hour */}
      {r.happyHour && (
        <div style={{
          margin: "0.75rem 1.25rem",
          padding: "0.75rem",
          borderRadius: "10px",
          backgroundColor: happyHour ? "rgba(255,107,107,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${happyHour ? "rgba(255,107,107,0.35)" : "rgba(255,255,255,0.08)"}`
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FF6B6B", marginBottom: "0.3rem" }}>
            🍹 Happy Hour
          </p>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#c8e6f5" }}>
            {r.happyHour.days.map(d => DAY_LABELS[d].slice(0, 3)).join(", ")} · {formatTime(r.happyHour.start)} – {formatTime(r.happyHour.end)}
          </p>
          <ul style={{ marginTop: "0.3rem", padding: 0, listStyle: "none" }}>
            {r.happyHour.deals.map((deal, i) => (
              <li key={i} style={{ fontSize: "0.87rem", color: "#a8cfe0" }}>• {deal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily Specials */}
      {todaySpecials.length > 0 && (
        <div style={{
          margin: "0.75rem 1.25rem",
          padding: "0.75rem",
          borderRadius: "10px",
          backgroundColor: "rgba(78,205,196,0.08)",
          border: "1px solid rgba(78,205,196,0.2)"
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4ECDC4", marginBottom: "0.3rem" }}>
            ⭐ Today&apos;s Specials
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {todaySpecials.map((deal, i) => (
              <li key={i} style={{ fontSize: "0.87rem", color: "#a8cfe0" }}>• {deal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer row */}
      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {r.phone && (
            <a href={`tel:${r.phone}`} style={{ color: "#4ECDC4", fontSize: "0.85rem", textDecoration: "none" }}>
              📞 {r.phone}
            </a>
          )}
          {r.instagram && (
            <a href={`https://instagram.com/${r.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: "#4ECDC4", fontSize: "0.85rem", textDecoration: "none" }}>
              📸 @{r.instagram}
            </a>
          )}
        </div>
        {onMapFocus && (
          <button onClick={() => onMapFocus(r.id)} style={{ color: "#8bb8d4", background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem" }}>
            📍 Map
          </button>
        )}
      </div>

      {r.notes && (
        <div style={{ padding: "0 1.25rem 1rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#5a7a90", fontStyle: "italic" }}>{r.notes}</p>
        </div>
      )}
    </div>
  );
}
