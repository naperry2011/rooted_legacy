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
      url: "",
      blurb: "Wellness partner — A1C / BP checks, yoga, fitness programming.",
    },
    {
      name: "Cre8tive Alignment Network",
      url: "https://cre8tivealignmentnetwork.org",
      blurb: "Values & ethics programming — the 7 Pillars of a Healthy Culture.",
    },
  ],
  nav: [
    { label: "Home", href: "/", live: true },
    { label: "Events", href: "/events", live: true },
    { label: "History", href: "/history", live: true },
    { label: "Weather", href: "/weather", live: true },
    { label: "Classes", href: "/classes", live: false },
    { label: "Shop", href: "/shop", live: false },
  ],
} as const;
