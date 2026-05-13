import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getHistoryArticle, historySlugs } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams() {
  return (await historySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getHistoryArticle(slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.excerpt,
  };
}

const mdxComponents = {
  h1: (p: React.ComponentProps<"h1">) => (
    <h1
      className="font-display text-3xl sm:text-4xl text-primary mt-10 sm:mt-12 mb-3 sm:mb-4 leading-tight"
      {...p}
    />
  ),
  h2: (p: React.ComponentProps<"h2">) => (
    <h2
      className="font-display text-2xl sm:text-3xl text-cream mt-8 sm:mt-10 mb-3 leading-tight"
      {...p}
    />
  ),
  h3: (p: React.ComponentProps<"h3">) => (
    <h3
      className="font-display text-xl sm:text-2xl text-cream mt-6 sm:mt-8 mb-2"
      {...p}
    />
  ),
  p: (p: React.ComponentProps<"p">) => (
    <p className="text-ink leading-relaxed my-4" {...p} />
  ),
  ul: (p: React.ComponentProps<"ul">) => (
    <ul className="list-disc pl-6 my-4 text-ink space-y-1" {...p} />
  ),
  ol: (p: React.ComponentProps<"ol">) => (
    <ol className="list-decimal pl-6 my-4 text-ink space-y-1" {...p} />
  ),
  a: (p: React.ComponentProps<"a">) => (
    <a className="text-primary underline-offset-4 hover:underline" {...p} />
  ),
  strong: (p: React.ComponentProps<"strong">) => (
    <strong className="text-cream" {...p} />
  ),
  hr: () => <hr className="my-10 border-line" />,
};

export default async function HistoryArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getHistoryArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <Link
        href="/history"
        className="text-sm text-ink-muted hover:text-primary"
      >
        ← Back to history
      </Link>
      <header className="mt-6 mb-8 sm:mb-10 border-b border-line pb-6 sm:pb-8">
        <h1 className="font-display text-3xl sm:text-5xl text-primary leading-tight">
          {article.frontmatter.title}
        </h1>
        {article.frontmatter.date && (
          <p className="mt-3 text-sm text-ink-muted/70">
            {new Date(article.frontmatter.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {article.frontmatter.author
              ? ` · ${article.frontmatter.author}`
              : ""}
          </p>
        )}
      </header>
      <div className="prose-rooted">
        <MDXRemote source={article.content} components={mdxComponents} />
      </div>
    </article>
  );
}
