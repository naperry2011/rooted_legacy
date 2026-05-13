// Server-only OpenWeather client. Free-tier endpoints:
//   /data/2.5/weather  (current)
//   /data/2.5/forecast (5-day / 3-hour)
//
// Returns null when OPENWEATHER_API_KEY is unset so the UI can degrade.

import "server-only";

const LAT = Number(process.env.WEATHER_LAT ?? 39.7745); // ~865 N German Church Rd
const LON = Number(process.env.WEATHER_LON ?? -86.0103);
const UNITS = process.env.WEATHER_UNITS ?? "imperial";
const REVALIDATE_SECONDS = 60 * 30; // 30 min — well inside free-tier limits

export type CurrentWeather = {
  tempF: number;
  feelsLikeF: number;
  description: string;
  icon: string;
  windMph: number;
  humidityPct: number;
  observedAt: number;
  city: string;
};

export type ForecastSlot = {
  time: number;
  tempF: number;
  description: string;
  icon: string;
  pop: number; // probability of precipitation 0–1
};

export type DailyForecast = {
  date: string;
  minF: number;
  maxF: number;
  description: string;
  icon: string;
  pop: number;
};

function isConfigured(): boolean {
  return Boolean(process.env.OPENWEATHER_API_KEY);
}

export function weatherConfigured(): boolean {
  return isConfigured();
}

async function owFetch<T>(path: string): Promise<T | null> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return null;
  const url = new URL(`https://api.openweathermap.org/data/2.5/${path}`);
  url.searchParams.set("lat", String(LAT));
  url.searchParams.set("lon", String(LON));
  url.searchParams.set("units", UNITS);
  url.searchParams.set("appid", key);
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["weather"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type OWCurrent = {
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  dt: number;
  name: string;
};

type OWForecast = {
  list: {
    dt: number;
    main: { temp: number; temp_min: number; temp_max: number };
    weather: { description: string; icon: string }[];
    pop: number;
  }[];
};

export async function getCurrent(): Promise<CurrentWeather | null> {
  const data = await owFetch<OWCurrent>("weather");
  if (!data) return null;
  const w = data.weather[0];
  return {
    tempF: Math.round(data.main.temp),
    feelsLikeF: Math.round(data.main.feels_like),
    description: w?.description ?? "",
    icon: w?.icon ?? "01d",
    windMph: Math.round(data.wind.speed),
    humidityPct: data.main.humidity,
    observedAt: data.dt * 1000,
    city: data.name,
  };
}

export async function getHourly(limit = 8): Promise<ForecastSlot[]> {
  const data = await owFetch<OWForecast>("forecast");
  if (!data) return [];
  return data.list.slice(0, limit).map((s) => ({
    time: s.dt * 1000,
    tempF: Math.round(s.main.temp),
    description: s.weather[0]?.description ?? "",
    icon: s.weather[0]?.icon ?? "01d",
    pop: s.pop,
  }));
}

export async function getDaily(): Promise<DailyForecast[]> {
  const data = await owFetch<OWForecast>("forecast");
  if (!data) return [];
  // Group 3-hour slots into local-day buckets
  const buckets = new Map<
    string,
    { min: number; max: number; icon: string; description: string; pop: number }
  >();
  for (const s of data.list) {
    const date = new Date(s.dt * 1000);
    const key = date.toISOString().slice(0, 10);
    const cur = buckets.get(key);
    if (!cur) {
      buckets.set(key, {
        min: s.main.temp_min,
        max: s.main.temp_max,
        icon: s.weather[0]?.icon ?? "01d",
        description: s.weather[0]?.description ?? "",
        pop: s.pop,
      });
    } else {
      cur.min = Math.min(cur.min, s.main.temp_min);
      cur.max = Math.max(cur.max, s.main.temp_max);
      cur.pop = Math.max(cur.pop, s.pop);
      // Prefer midday slot's icon (12:00 local-ish)
      const h = date.getHours();
      if (h >= 11 && h <= 14) {
        cur.icon = s.weather[0]?.icon ?? cur.icon;
        cur.description = s.weather[0]?.description ?? cur.description;
      }
    }
  }
  return Array.from(buckets.entries())
    .slice(0, 5)
    .map(([date, v]) => ({
      date,
      minF: Math.round(v.min),
      maxF: Math.round(v.max),
      icon: v.icon,
      description: v.description,
      pop: v.pop,
    }));
}

export function iconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
