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

  return (
    <div
      id={`card-${r.id}`}
      className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 transition-all ${
        happyHour ? "border-coral" : open ? "border-ocean-light" : "border-sand-100"
      }`}
    >
      {/* Card Header */}
      <div className={`px-5 pt-5 pb-3 ${happyHour ? "bg-coral/5" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pacifico text-xl text-ocean-dark hover:text-ocean transition-colors leading-tight"
            >
              {r.name}
            </a>
            <p className="text-gray-500 text-sm mt-1">{r.address}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {mounted && happyHour && (
              <span className="bg-coral text-white text-xs font-bold px-2 py-1 rounded-full">
                🍺 HAPPY HOUR
              </span>
            )}
            {mounted && open && !happyHour && (
              <span className="bg-ocean-light text-white text-xs font-bold px-2 py-1 rounded-full">
                ✅ OPEN
              </span>
            )}
            {mounted && !open && (
              <span className="bg-gray-200 text-gray-500 text-xs font-semibold px-2 py-1 rounded-full">
                CLOSED
              </span>
            )}
          </div>
        </div>

        {/* Today's hours */}
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">{DAY_LABELS[todayKey]}:</span>{" "}
          {todayHours
            ? `${formatTime(todayHours.open)} – ${formatTime(todayHours.close)}`
            : "Hours not listed"}
        </div>
      </div>

      {/* Happy Hour */}
      {r.happyHour && (
        <div className={`mx-5 my-3 rounded-xl p-3 ${happyHour ? "bg-coral/10 border border-coral/30" : "bg-sand-50 border border-sand-200"}`}>
          <p className="text-xs font-bold uppercase tracking-wide text-coral mb-1">
            🍹 Happy Hour
          </p>
          <p className="text-sm font-semibold text-gray-700">
            {r.happyHour.days.map(d => DAY_LABELS[d].slice(0, 3)).join(", ")} · {formatTime(r.happyHour.start)} – {formatTime(r.happyHour.end)}
          </p>
          <ul className="mt-1 space-y-0.5">
            {r.happyHour.deals.map((deal, i) => (
              <li key={i} className="text-sm text-gray-600">• {deal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily Specials */}
      {todaySpecials.length > 0 && (
        <div className="mx-5 my-3 bg-sand-100 rounded-xl p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ocean-dark mb-1">
            ⭐ Today&apos;s Specials
          </p>
          <ul className="space-y-0.5">
            {todaySpecials.map((deal, i) => (
              <li key={i} className="text-sm text-gray-700">• {deal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-sand-100 flex items-center justify-between">
        <div className="flex gap-3 text-sm">
          {r.phone && (
            <a href={`tel:${r.phone}`} className="text-ocean hover:text-ocean-dark transition-colors">
              📞 {r.phone}
            </a>
          )}
          {r.twitter && (
            <a
              href={`https://twitter.com/${r.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean hover:text-ocean-dark transition-colors"
            >
              𝕏 @{r.twitter}
            </a>
          )}
        </div>
        {onMapFocus && (
          <button
            onClick={() => onMapFocus(r.id)}
            className="text-xs text-ocean-light hover:text-ocean-dark transition-colors"
          >
            📍 Map
          </button>
        )}
      </div>

      {/* Notes */}
      {r.notes && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-400 italic">{r.notes}</p>
        </div>
      )}
    </div>
  );
}
