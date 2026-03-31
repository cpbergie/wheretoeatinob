"use client";

import { useEffect, useState } from "react";
import { Restaurant } from "@/lib/types";
import {
  isOpenNow, isHappyHourNow, formatTime, getTodaySpecials,
  getCurrentDayKey, DAY_LABELS, DAY_KEYS
} from "@/lib/timeUtils";

interface Props {
  restaurant: Restaurant;
  onMapFocus?: (id: string) => void;
}

export default function RestaurantCard({ restaurant: r, onMapFocus }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [happyHour, setHappyHour] = useState(false);
  const [showAllSpecials, setShowAllSpecials] = useState(false);

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

  // Build full week specials map
  const allSpecialsByDay = DAY_KEYS.map(day => {
    const deals: string[] = [];
    for (const special of r.dailySpecials) {
      if (special.day === "all" || special.day === day) {
        deals.push(...special.deals);
      }
    }
    return { day, deals };
  }).filter(d => d.deals.length > 0);

  const hasWeeklySpecials = allSpecialsByDay.length > 0;
  const borderColor = "#E8854A";
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
      <div style={{ padding: "1rem 1rem 0.75rem", backgroundColor: headerBg }}>
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
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(r.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#8bb8d4", fontSize: "0.82rem", marginTop: "0.2rem", display: "block", textDecoration: "none" }}
            >
              📍 {r.address}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-end", flexShrink: 0 }}>
            {mounted && happyHour && (
              <span style={{ backgroundColor: "#5BC8E8", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                🍻 HAPPY HOUR
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
          {todayHours === null && Object.values(r.hours).some(h => h !== null) ? "Closed today" : todayHours ? `${formatTime(todayHours.open)} – ${formatTime(todayHours.close)}` : "Hours not listed"}
        </p>
      </div>

      {/* Happy Hour */}
      {r.happyHour && (
        <div style={{
          margin: "0.75rem 1rem",
          padding: "0.75rem",
          borderRadius: "10px",
          backgroundColor: happyHour ? "rgba(91,200,232,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${happyHour ? "rgba(91,200,232,0.35)" : "rgba(255,255,255,0.08)"}`
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5BC8E8", marginBottom: "0.3rem" }}>
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

      {/* Today's Specials */}
      {todaySpecials.length > 0 && !showAllSpecials && (
        <div style={{
          margin: "0.75rem 1rem",
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

      {/* All Week Specials (expanded) */}
      {showAllSpecials && hasWeeklySpecials && (
        <div style={{
          margin: "0.75rem 1rem",
          padding: "0.75rem",
          borderRadius: "10px",
          backgroundColor: "rgba(78,205,196,0.08)",
          border: "1px solid rgba(78,205,196,0.2)"
        }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4ECDC4", marginBottom: "0.5rem" }}>
            ⭐ Weekly Specials
          </p>
          {allSpecialsByDay.map(({ day, deals }) => (
            <div key={day} style={{ marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: day === todayKey ? "#4ECDC4" : "#c8e6f5", marginBottom: "0.15rem" }}>
                {DAY_LABELS[day]}{day === todayKey ? " (today)" : ""}
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {deals.map((deal, i) => (
                  <li key={i} style={{ fontSize: "0.85rem", color: "#a8cfe0" }}>• {deal}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* See all specials toggle */}
      {hasWeeklySpecials && (
        <div style={{ padding: "0 1rem 0.5rem" }}>
          <button
            onClick={() => setShowAllSpecials(v => !v)}
            style={{ background: "none", border: "none", color: "#5BC8E8", fontSize: "0.82rem", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            {showAllSpecials ? "▲ Hide weekly specials" : "▼ See all weekly specials"}
          </button>
        </div>
      )}

      {/* Footer row */}
      <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {r.phone && (
            <a href={`tel:${r.phone}`} style={{ color: "#4ECDC4", fontSize: "0.85rem", textDecoration: "none" }}>
              📞 {r.phone}
            </a>
          )}
        </div>

      </div>

      {r.notes && (
        <div style={{ padding: "0 1rem 1rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#5a7a90", fontStyle: "italic" }}>{r.notes}</p>
        </div>
      )}
    </div>
  );
}
