// Server-only weather client. Provider is selectable via WEATHER_PROVIDER:
//   "open-meteo"  (default) — no key required
//   "openweather"          — requires OPENWEATHER_API_KEY

import "server-only";

const LAT = Number(process.env.WEATHER_LAT ?? 39.7745); // ~865 N German Church Rd
const LON = Number(process.env.WEATHER_LON ?? -86.0103);
const UNITS = process.env.WEATHER_UNITS ?? "imperial";
const REVALIDATE_SECONDS = 60 * 30;

type Provider = "open-meteo" | "openweather";

function provider(): Provider {
  const explicit = (process.env.WEATHER_PROVIDER ?? "").toLowerCase();
  if (explicit === "openweather") return "openweather";
  if (explicit === "open-meteo") return "open-meteo";
  // Auto: use openweather only if its key is configured.
  return process.env.OPENWEATHER_API_KEY ? "openweather" : "open-meteo";
}

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
  pop: number;
};

export type DailyForecast = {
  date: string;
  minF: number;
  maxF: number;
  description: string;
  icon: string;
  pop: number;
};

export function weatherConfigured(): boolean {
  const p = provider();
  if (p === "open-meteo") return true;
  return Boolean(process.env.OPENWEATHER_API_KEY);
}

export function activeProvider(): Provider {
  return provider();
}

// -------------------------------------------------------------------------- //
// OpenWeather (free /data/2.5/* endpoints)
// -------------------------------------------------------------------------- //

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

async function owCurrent(): Promise<CurrentWeather | null> {
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

async function owHourly(limit: number): Promise<ForecastSlot[]> {
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

async function owDaily(): Promise<DailyForecast[]> {
  const data = await owFetch<OWForecast>("forecast");
  if (!data) return [];
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

// -------------------------------------------------------------------------- //
// Open-Meteo (no key, free, https://open-meteo.com)
// -------------------------------------------------------------------------- //

type OMResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: 0 | 1;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: (0 | 1)[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
};

// WMO weather code → OpenWeather-style icon + description, so the UI stays consistent.
function describeWmo(
  code: number,
  isDay = true,
): { description: string; iconBase: string } {
  // iconBase without the d/n suffix; caller appends.
  if (code === 0) return { description: "clear sky", iconBase: "01" };
  if (code === 1) return { description: "mainly clear", iconBase: "02" };
  if (code === 2) return { description: "partly cloudy", iconBase: "03" };
  if (code === 3) return { description: "overcast", iconBase: "04" };
  if (code === 45 || code === 48) return { description: "fog", iconBase: "50" };
  if (code === 51) return { description: "light drizzle", iconBase: "09" };
  if (code === 53) return { description: "drizzle", iconBase: "09" };
  if (code === 55) return { description: "heavy drizzle", iconBase: "09" };
  if (code === 56 || code === 57)
    return { description: "freezing drizzle", iconBase: "09" };
  if (code === 61) return { description: "light rain", iconBase: "10" };
  if (code === 63) return { description: "rain", iconBase: "10" };
  if (code === 65) return { description: "heavy rain", iconBase: "10" };
  if (code === 66 || code === 67)
    return { description: "freezing rain", iconBase: "13" };
  if (code === 71) return { description: "light snow", iconBase: "13" };
  if (code === 73) return { description: "snow", iconBase: "13" };
  if (code === 75) return { description: "heavy snow", iconBase: "13" };
  if (code === 77) return { description: "snow grains", iconBase: "13" };
  if (code === 80) return { description: "light rain showers", iconBase: "09" };
  if (code === 81) return { description: "rain showers", iconBase: "09" };
  if (code === 82) return { description: "violent rain showers", iconBase: "09" };
  if (code === 85) return { description: "light snow showers", iconBase: "13" };
  if (code === 86) return { description: "snow showers", iconBase: "13" };
  if (code === 95) return { description: "thunderstorm", iconBase: "11" };
  if (code === 96 || code === 99)
    return { description: "thunderstorm with hail", iconBase: "11" };
  return { description: "unknown", iconBase: "50" };
  void isDay; // suffix attached by caller
}

function wmoIcon(code: number, isDay = true): string {
  const { iconBase } = describeWmo(code);
  return `${iconBase}${isDay ? "d" : "n"}`;
}

async function omFetch(): Promise<OMResponse | null> {
  const tempUnit = UNITS === "metric" ? "celsius" : "fahrenheit";
  const windUnit = UNITS === "metric" ? "kmh" : "mph";
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(LAT));
  url.searchParams.set("longitude", String(LON));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,weather_code,precipitation_probability,is_day",
  );
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
  );
  url.searchParams.set("temperature_unit", tempUnit);
  url.searchParams.set("wind_speed_unit", windUnit);
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["weather"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as OMResponse;
  } catch {
    return null;
  }
}

async function omCurrent(): Promise<CurrentWeather | null> {
  const data = await omFetch();
  if (!data?.current) return null;
  const c = data.current;
  const isDay = c.is_day === 1;
  const { description } = describeWmo(c.weather_code, isDay);
  return {
    tempF: Math.round(c.temperature_2m),
    feelsLikeF: Math.round(c.apparent_temperature),
    description,
    icon: wmoIcon(c.weather_code, isDay),
    windMph: Math.round(c.wind_speed_10m),
    humidityPct: c.relative_humidity_2m,
    observedAt: new Date(c.time).getTime(),
    city: "Indianapolis",
  };
}

async function omHourly(limit: number): Promise<ForecastSlot[]> {
  const data = await omFetch();
  if (!data?.hourly) return [];
  const h = data.hourly;
  // Find the index closest to "now" and take `limit` slots from there
  const now = Date.now();
  const times = h.time.map((t) => new Date(t).getTime());
  let start = 0;
  for (let i = 0; i < times.length; i++) {
    if (times[i] >= now) {
      start = Math.max(0, i - 1);
      break;
    }
  }
  return times.slice(start, start + limit).map((t, i) => {
    const idx = start + i;
    const isDay = h.is_day[idx] === 1;
    const { description } = describeWmo(h.weather_code[idx], isDay);
    return {
      time: t,
      tempF: Math.round(h.temperature_2m[idx]),
      description,
      icon: wmoIcon(h.weather_code[idx], isDay),
      pop: (h.precipitation_probability[idx] ?? 0) / 100,
    };
  });
}

async function omDaily(): Promise<DailyForecast[]> {
  const data = await omFetch();
  if (!data?.daily) return [];
  const d = data.daily;
  return d.time.slice(0, 5).map((date, i) => {
    const { description } = describeWmo(d.weather_code[i], true);
    return {
      date,
      minF: Math.round(d.temperature_2m_min[i]),
      maxF: Math.round(d.temperature_2m_max[i]),
      description,
      icon: wmoIcon(d.weather_code[i], true),
      pop: (d.precipitation_probability_max[i] ?? 0) / 100,
    };
  });
}

// -------------------------------------------------------------------------- //
// Public dispatchers
// -------------------------------------------------------------------------- //

export async function getCurrent(): Promise<CurrentWeather | null> {
  return provider() === "openweather" ? owCurrent() : omCurrent();
}

export async function getHourly(limit = 8): Promise<ForecastSlot[]> {
  return provider() === "openweather" ? owHourly(limit) : omHourly(limit);
}

export async function getDaily(): Promise<DailyForecast[]> {
  return provider() === "openweather" ? owDaily() : omDaily();
}

export function iconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
