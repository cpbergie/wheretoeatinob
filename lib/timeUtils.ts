import { DayKey, Restaurant, HappyHour } from "./types";

export const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const DAY_LABELS: Record<DayKey, string> = {
  sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday",
  thu: "Thursday", fri: "Friday", sat: "Saturday",
};

export function getCurrentDayKey(): DayKey {
  return DAY_KEYS[new Date().getDay()];
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m === 0 ? `${hour} ${period}` : `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function isOpenNow(restaurant: Restaurant): boolean {
  const day = getCurrentDayKey();
  const hours = restaurant.hours[day];
  if (!hours) return false;
  const now = getCurrentTimeMinutes();
  return now >= timeToMinutes(hours.open) && now < timeToMinutes(hours.close);
}

export function isHappyHourNow(happyHour: HappyHour | null): boolean {
  if (!happyHour) return false;
  const day = getCurrentDayKey();
  if (!happyHour.days.includes(day)) return false;
  const now = getCurrentTimeMinutes();
  return now >= timeToMinutes(happyHour.start) && now < timeToMinutes(happyHour.end);
}

export function getTodaySpecials(restaurant: Restaurant): string[] {
  const day = getCurrentDayKey();
  const deals: string[] = [];
  for (const special of restaurant.dailySpecials) {
    if (special.day === "all" || special.day === day) {
      deals.push(...special.deals);
    }
  }
  return deals;
}

export function formatCurrentTime(): string {
  const now = new Date();
  const day = DAY_LABELS[getCurrentDayKey()];
  const h = now.getHours();
  const m = now.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const min = m.toString().padStart(2, "0");
  return `${day} ${hour}:${min} ${period}`;
}
