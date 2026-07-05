export type Vendor = {
  slug: string;
  name: string;
  blurb: string;
  services: readonly string[];
  photo?: string;
  website?: string;
  instagram?: string;
  phone?: string;
  email?: string;
  // Past events this vendor showed up at — used to link back to event pages.
  eventSlugs?: readonly string[];
};

/**
 * Vendors / featured small businesses that have been on the farm.
 * Long-term partners (Bodi Buzz, Cre8tive Alignment Network) live in
 * `content/site.ts` under `partners`. This list is for vendors who have
 * appeared at events but aren't ongoing co-organizers.
 *
 * Once Phase 2 ships the DB-backed `vendor_profiles` table, this array
 * becomes a one-time seed.
 */
export const featuredVendors: readonly Vendor[] = [
  {
    slug: "pure-trition",
    name: "Pure-trition",
    blurb:
      "Juice and smoothie bar from Indianapolis — cold-pressed juices, fruit bowls, açai, and smoothies served at events around the city.",
    services: ["Cold-pressed juice", "Smoothies", "Fruit bowls", "Açai"],
    photo: "/gallery/grand-opening-pure-trition.jpg",
    instagram: "pure_trition",
    phone: "317-775-2655",
    eventSlugs: ["urban-farm-grand-opening"],
  },
];
