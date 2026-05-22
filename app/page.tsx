import { Hero } from "@/components/marketing/Hero";
import { WhatWeDo } from "@/components/marketing/WhatWeDo";
import { LocationCard } from "@/components/marketing/LocationCard";
import { PartnerStrip } from "@/components/marketing/PartnerStrip";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { WhatsGrowing } from "@/components/produce/WhatsGrowing";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 grid gap-4 sm:gap-5 md:grid-cols-2">
        <WhatsGrowing />
        <WeatherWidget />
      </section>
      <LocationCard />
      <PartnerStrip />
    </>
  );
}
