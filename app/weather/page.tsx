import Image from "next/image";
import type { Metadata } from "next";
import { Droplets, Wind, CloudOff } from "lucide-react";
import {
  getCurrent,
  getDaily,
  getHourly,
  iconUrl,
  weatherConfigured,
} from "@/lib/weather";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Weather",
  description: `Current conditions and forecast for ${site.address.full}.`,
};

export const revalidate = 1800; // 30 minutes

function dayLabel(iso: string, idx: number) {
  if (idx === 0) return "Today";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
  });
}

function hourLabel(ms: number, idx: number) {
  if (idx === 0) return "Now";
  return new Date(ms).toLocaleTimeString(undefined, { hour: "numeric" });
}

export default async function WeatherPage() {
  if (!weatherConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl text-primary">Weather</h1>
        <div className="mt-8 rounded-2xl border border-line bg-bg-elev p-6 sm:p-8 flex items-start gap-4">
          <CloudOff className="h-6 w-6 text-primary-deep mt-1 shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="font-display text-xl text-cream">Not configured</p>
            <p className="mt-2 text-ink-muted break-words">
              Set <code className="text-primary">OPENWEATHER_API_KEY</code> in{" "}
              <code className="text-primary">.env.local</code> and restart the
              dev server.
            </p>
            <p className="mt-2 text-sm text-ink-muted/70">
              Get a free key at{" "}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                openweathermap.org/api
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [current, hourly, daily] = await Promise.all([
    getCurrent(),
    getHourly(8),
    getDaily(),
  ]);

  if (!current) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl text-primary">Weather</h1>
        <p className="mt-6 text-ink-muted">
          Couldn&apos;t reach the weather service. Try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          On the farm
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">Weather</h1>
        <p className="mt-3 text-ink-muted">{site.address.full}</p>
      </header>

      <section className="rounded-2xl border border-line bg-bg-elev p-5 sm:p-8 bg-grain">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:contents">
            <Image
              src={iconUrl(current.icon)}
              alt={current.description}
              width={96}
              height={96}
              unoptimized
              className="sm:w-32 sm:h-32 shrink-0"
            />
            <div className="flex-1 min-w-0 sm:hidden">
              <p className="font-display text-5xl text-cream leading-none">
                {current.tempF}°F
              </p>
              <p className="mt-1 text-sm text-ink-muted capitalize">
                {current.description}
              </p>
            </div>
          </div>
          <div className="hidden sm:block flex-1 min-w-0">
            <p className="font-display text-6xl md:text-7xl text-cream leading-none">
              {current.tempF}°F
            </p>
            <p className="mt-1 text-ink-muted capitalize">
              {current.description} · feels like {current.feelsLikeF}°
            </p>
          </div>
          <div className="sm:hidden text-sm text-ink-muted">
            feels like {current.feelsLikeF}°
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink-muted w-full sm:w-auto">
            <p className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-primary" aria-hidden />
              {current.windMph} mph
            </p>
            <p className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" aria-hidden />
              {current.humidityPct}%
            </p>
          </div>
        </div>
      </section>

      {hourly.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream mb-4">
            Next 24 hours
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {hourly.map((h, i) => (
              <div
                key={h.time}
                className="rounded-xl border border-line bg-bg-elev p-2 sm:p-3 text-center"
              >
                <p className="text-[10px] sm:text-xs text-ink-muted/70">
                  {hourLabel(h.time, i)}
                </p>
                <Image
                  src={iconUrl(h.icon)}
                  alt={h.description}
                  width={48}
                  height={48}
                  unoptimized
                  className="mx-auto"
                />
                <p className="font-display text-base sm:text-lg text-cream">
                  {h.tempF}°
                </p>
                <p className="text-[10px] text-ink-muted">
                  {Math.round(h.pop * 100)}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {daily.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream mb-4">
            5-day outlook
          </h2>
          <ul className="rounded-2xl border border-line bg-bg-elev divide-y divide-line">
            {daily.map((d, i) => (
              <li
                key={d.date}
                className="grid grid-cols-[3.5rem_2.5rem_1fr_auto] sm:grid-cols-[5rem_3rem_1fr_3rem_5rem] items-center gap-2 sm:gap-4 p-3 sm:p-4"
              >
                <p className="font-display text-base sm:text-lg text-cream">
                  {dayLabel(d.date, i)}
                </p>
                <Image
                  src={iconUrl(d.icon)}
                  alt={d.description}
                  width={40}
                  height={40}
                  unoptimized
                  className="sm:w-12 sm:h-12"
                />
                <p className="text-xs sm:text-sm text-ink-muted capitalize truncate">
                  {d.description}
                </p>
                <p className="hidden sm:block text-xs text-ink-muted/70 text-right">
                  {Math.round(d.pop * 100)}%
                </p>
                <p className="font-display text-base sm:text-lg text-cream text-right whitespace-nowrap">
                  <span className="text-ink-muted">{d.minF}°</span>
                  <span className="mx-1 text-ink-muted/50">/</span>
                  {d.maxF}°
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-xs text-ink-muted/60">
        Data:{" "}
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary"
        >
          OpenWeather
        </a>
        . Updates every 30 minutes.
      </p>
    </div>
  );
}
