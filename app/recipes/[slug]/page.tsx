import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, Users, ChefHat } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getRecipe, recipeSlugs } from "@/lib/recipes";

type Params = { slug: string };

export async function generateStaticParams() {
  return (await recipeSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return { title: "Not found" };
  return {
    title: recipe.frontmatter.title,
    description: recipe.frontmatter.excerpt,
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

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  const { frontmatter } = recipe;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <Link
        href="/recipes"
        className="text-sm text-ink-muted hover:text-primary"
      >
        ← All recipes
      </Link>

      <header className="mt-6 mb-8 sm:mb-10 border-b border-line pb-6 sm:pb-8">
        <ChefHat className="h-7 w-7 text-primary mb-3" aria-hidden />
        <h1 className="font-display text-3xl sm:text-5xl text-primary leading-tight">
          {frontmatter.title}
        </h1>
        {frontmatter.excerpt && (
          <p className="mt-4 text-base sm:text-lg text-ink-muted">
            {frontmatter.excerpt}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-ink-muted">
          {frontmatter.prep_time && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              Prep {frontmatter.prep_time}
            </p>
          )}
          {frontmatter.cook_time && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              Cook {frontmatter.cook_time}
            </p>
          )}
          {frontmatter.yield && (
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" aria-hidden />
              {frontmatter.yield}
            </p>
          )}
        </div>
      </header>

      <div className="prose-rooted">
        <MDXRemote source={recipe.content} components={mdxComponents} />
      </div>
    </article>
  );
}
