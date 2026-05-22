import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");

export type RecipeFrontmatter = {
  title: string;
  date?: string;
  excerpt?: string;
  season?: "spring" | "summer" | "fall" | "winter" | "year-round";
  ingredients?: string[];
  prep_time?: string;
  cook_time?: string;
  yield?: string;
  photo?: string;
};

export type Recipe = {
  slug: string;
  frontmatter: RecipeFrontmatter;
  content: string;
};

export type RecipeSummary = {
  slug: string;
  title: string;
  excerpt?: string;
  season: string;
  prep_time: string;
  ingredients: string[];
  photo?: string;
};

async function readAll(): Promise<Recipe[]> {
  const entries = await fs.readdir(RECIPES_DIR).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith(".mdx"));
  return Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(RECIPES_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        frontmatter: data as RecipeFrontmatter,
        content,
      };
    }),
  );
}

export async function listRecipes(): Promise<RecipeSummary[]> {
  const all = await readAll();
  return all
    .map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      season: frontmatter.season ?? "year-round",
      prep_time: frontmatter.prep_time ?? "",
      ingredients: frontmatter.ingredients ?? [],
      photo: frontmatter.photo,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const raw = await fs.readFile(
      path.join(RECIPES_DIR, `${slug}.mdx`),
      "utf8",
    );
    const { data, content } = matter(raw);
    return { slug, frontmatter: data as RecipeFrontmatter, content };
  } catch {
    return null;
  }
}

export async function recipeSlugs(): Promise<string[]> {
  const all = await listRecipes();
  return all.map((r) => r.slug);
}

export async function listRecipesByIngredient(
  ingredient: string,
): Promise<RecipeSummary[]> {
  const needle = ingredient.toLowerCase();
  const all = await listRecipes();
  return all.filter((r) =>
    r.ingredients.some((i) => i.toLowerCase().includes(needle)),
  );
}
