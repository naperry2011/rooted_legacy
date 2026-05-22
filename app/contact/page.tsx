import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Rooted Legacy.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          Get in touch
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Contact
        </h1>
        <p className="mt-4 text-ink-muted flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" aria-hidden />
          {site.address.full}
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
