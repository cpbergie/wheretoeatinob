export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface DayHours {
  open: string;
  close: string;
}

export interface HappyHour {
  days: DayKey[];
  start: string;
  end: string;
  deals: string[];
}

export interface DailySpecial {
  day: DayKey | "all";
  deals: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
  phone: string | null;
  website: string;
  twitter: string | null;
  hours: Record<DayKey, DayHours | null>;
  happyHour: HappyHour | null;
  dailySpecials: DailySpecial[];
  notes: string | null;
}
