import { Hero } from "@/components/marketing/Hero";
import { WhatWeDo } from "@/components/marketing/WhatWeDo";
import { LocationCard } from "@/components/marketing/LocationCard";
import { PartnerStrip } from "@/components/marketing/PartnerStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <LocationCard />
      <PartnerStrip />
    </>
  );
}
