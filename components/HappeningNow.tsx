"use client";

import { useEffect, useState } from "react";
import { Restaurant } from "@/lib/types";
import { isHappyHourNow, isOpenNow, formatCurrentTime } from "@/lib/timeUtils";

interface Props {
  restaurants: Restaurant[];
  showAll: boolean;
  onToggle: () => void;
}

export default function HappeningNow({ restaurants, showAll, onToggle }: Props) {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [happyCount, setHappyCount] = useState(0);
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setTimeStr(formatCurrentTime());
      setHappyCount(restaurants.filter(r => isHappyHourNow(r.happyHour)).length);
      setOpenCount(restaurants.filter(r => isOpenNow(r)).length);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [restaurants]);

  if (!mounted) return null;

  return (
    <div id="happening-now" className="bg-ocean-dark text-white rounded-2xl p-6 mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sand-100 text-sm mb-1">🕐 {timeStr}</p>
          {happyCount > 0 ? (
            <p className="text-xl font-bold">
              🍺 <span className="text-coral">{happyCount} {happyCount === 1 ? "spot has" : "spots have"}</span> happy hour right now!
            </p>
          ) : (
            <p className="text-xl font-bold text-sand-200">No happy hours active right now</p>
          )}
          <p className="text-sand-200 text-sm mt-1">{openCount} of {restaurants.length} places currently open</p>
        </div>
        <button
          onClick={onToggle}
          className="shrink-0 bg-coral hover:bg-coral-dark text-white font-semibold px-5 py-2 rounded-full transition-colors text-sm"
        >
          {showAll ? "Show Active Only" : "View All Places"}
        </button>
      </div>
    </div>
  );
}
