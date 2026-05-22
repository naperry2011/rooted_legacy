type Partner = {
  name: string;
  url?: string;
  blurb: string;
  tagline?: string;
  services?: readonly string[];
  instagram?: string;
  email?: string;
};

export const site = {
  name: "Rooted Legacy",
  tagline: "An urban farm growing food, classes, and community",
  description:
    "Rooted Legacy is an Indianapolis urban farm and education space. We grow produce for our neighbors, teach gardening classes, and host wellness events on the land.",
  url: "https://rootedlegacy.org",
  address: {
    line1: "865 N German Church Rd",
    city: "Indianapolis",
    state: "IN",
    full: "865 N German Church Rd, Indianapolis, IN",
  },
  socials: {
    instagram: "",
    facebook: "",
    email: "",
  },
  partners: [
    {
      name: "Bodi Buzz",
      url: "https://www.bodibuzz.com/",
      blurb:
        "Indianapolis-based wellness partner — organic herbal goods, sustainable agriculture, and community health education.",
      tagline:
        "Nature holds the key to restoring balance — and by using it we can empower communities to live healthier, more vibrant lives.",
      services: [
        "Herbal shop",
        "A1C + BP checks",
        "Yoga + fitness",
        "Urban farming education",
      ],
      instagram: "bodibuzz",
      email: "bodibuzz@gmail.com",
    },
    {
      name: "Cre8tive Alignment Network",
      url: "https://cre8tivealignmentnetwork.org",
      blurb:
        "Values & ethics programming — the 7 Pillars of a Healthy Culture series, building cultures of trust and aligned action.",
      services: ["Pillars series", "Leadership workshops", "Community speakers"],
    },
  ] satisfies readonly Partner[],
  nav: [
    { label: "Home", href: "/", live: true, primary: true },
    { label: "Events", href: "/events", live: true, primary: true },
    { label: "Shop", href: "/shop", live: true, primary: true },
    { label: "Recipes", href: "/recipes", live: true, primary: true },
    { label: "History", href: "/history", live: true, primary: true },
    { label: "Gallery", href: "/gallery", live: true, primary: false },
    { label: "Weather", href: "/weather", live: true, primary: false },
    { label: "Contact", href: "/contact", live: true, primary: false },
  ],
} as const;
