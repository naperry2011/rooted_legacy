import Link from "next/link";
import type { Metadata } from "next";
import { listHistoryArticles } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "History",
  description:
    "Stories of the land, the people, and the practices behind Rooted Legacy.",
};

export default async function HistoryIndex() {
  const articles = await listHistoryArticles();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary-deep mb-3">
          Our story
        </p>
        <h1 className="font-display text-5xl text-primary">History</h1>
        <p className="mt-4 text-ink-muted">
          Stories of the land, the people, and the practices behind Rooted
          Legacy.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-ink-muted">No articles yet — check back soon.</p>
      ) : (
        <ul className="divide-y divide-line">
          {articles.map(({ slug, frontmatter }) => (
            <li key={slug} className="py-6">
              <Link href={`/history/${slug}`} className="group block">
                <h2 className="font-display text-2xl text-cream group-hover:text-primary transition-colors">
                  {frontmatter.title}
                </h2>
                {frontmatter.date && (
                  <p className="text-xs text-ink-muted/70 mt-1">
                    {new Date(frontmatter.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {frontmatter.excerpt && (
                  <p className="mt-2 text-ink-muted">{frontmatter.excerpt}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
