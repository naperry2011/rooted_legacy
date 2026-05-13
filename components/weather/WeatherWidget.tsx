import Image from "next/image";
import Link from "next/link";
import { CloudOff } from "lucide-react";
import { getCurrent, iconUrl, weatherConfigured } from "@/lib/weather";

export async function WeatherWidget() {
  if (!weatherConfigured()) {
    return process.env.NODE_ENV === "production" ? null : (
      <div className="rounded-2xl border border-line bg-bg-elev p-5 text-sm text-ink-muted flex items-center gap-3">
        <CloudOff className="h-5 w-5 text-primary-deep" aria-hidden />
        <span>
          Weather widget inactive — set <code>OPENWEATHER_API_KEY</code> in{" "}
          <code>.env.local</code>.
        </span>
      </div>
    );
  }

  const current = await getCurrent();
  if (!current) return null;

  return (
    <Link
      href="/weather"
      className="group block rounded-2xl border border-line bg-bg-elev p-5 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-4">
        <Image
          src={iconUrl(current.icon)}
          alt={current.description}
          width={64}
          height={64}
          unoptimized
          className="drop-shadow"
        />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-primary-deep">
            On the farm
          </p>
          <p className="font-display text-3xl text-cream leading-tight">
            {current.tempF}°F
          </p>
          <p className="text-sm text-ink-muted capitalize">
            {current.description}
          </p>
        </div>
        <span className="text-xs text-ink-muted/70 group-hover:text-primary transition-colors">
          Forecast →
        </span>
      </div>
    </Link>
  );
}
