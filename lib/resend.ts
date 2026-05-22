import "server-only";

import { Resend } from "resend";

const FROM_DEFAULT = "Rooted Legacy <onboarding@resend.dev>";

let cached: Resend | null = null;

function client(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export function emailFrom() {
  return process.env.RESEND_FROM ?? FROM_DEFAULT;
}

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const c = client();
  if (!c) {
    // Soft-fail in dev when RESEND_API_KEY isn't set yet.
    console.warn("[resend] RESEND_API_KEY not set — skipping send:", args.subject);
    return { ok: true };
  }
  try {
    const { error } = await c.emails.send({
      from: emailFrom(),
      to: [args.to],
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send_failed" };
  }
}

/** Wrap content with a minimal brand-aligned HTML shell. */
export function wrapHtml(opts: {
  heading: string;
  intro: string;
  ctaLabel?: string;
  ctaUrl?: string;
  body?: string;
  footer?: string;
}) {
  const cta =
    opts.ctaLabel && opts.ctaUrl
      ? `<p style="margin:24px 0"><a href="${opts.ctaUrl}" style="display:inline-block;padding:12px 20px;border-radius:12px;background:#d9a441;color:#0b0b0a;text-decoration:none;font-weight:600">${opts.ctaLabel}</a></p>`
      : "";
  const body = opts.body
    ? `<div style="margin:16px 0;color:#3a3a36">${opts.body}</div>`
    : "";
  return `<!doctype html>
<html><body style="background:#fafaf6;font-family:Georgia,serif;color:#0b0b0a;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ead7a6;border-radius:16px;padding:28px">
    <h1 style="font-family:Georgia,serif;color:#a87423;margin:0 0 12px">${opts.heading}</h1>
    <p style="margin:0;color:#3a3a36">${opts.intro}</p>
    ${body}
    ${cta}
    <p style="margin-top:24px;font-size:12px;color:#8a7a4f">${opts.footer ?? "Rooted Legacy · 865 N German Church Rd, Indianapolis, IN"}</p>
  </div>
</body></html>`;
}
