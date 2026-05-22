import type { Metadata } from "next";
import { VendorForm } from "./VendorForm";

export const metadata: Metadata = {
  title: "Apply as a vendor",
  description:
    "Apply to vend at a Rooted Legacy event — food, wellness, crafts, all welcome.",
};

export default function VendorApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          For partners
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-primary">
          Apply as a vendor
        </h1>
        <p className="mt-4 text-ink-muted">
          We host community markets with food, wellness, crafts, and partner
          businesses. Tell us about yours and we&apos;ll be in touch about
          upcoming events.
        </p>
      </header>

      <VendorForm />
    </div>
  );
}
