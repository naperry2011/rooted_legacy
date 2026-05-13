import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const HISTORY_DIR = path.join(process.cwd(), "content", "history");

export type HistoryFrontmatter = {
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
};

export type HistoryArticle = {
  slug: string;
  frontmatter: HistoryFrontmatter;
  content: string;
};

export async function listHistoryArticles(): Promise<
  Array<{ slug: string; frontmatter: HistoryFrontmatter }>
> {
  const entries = await fs.readdir(HISTORY_DIR).catch(() => [] as string[]);
  const articles = await Promise.all(
    entries
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(HISTORY_DIR, file), "utf8");
        const { data } = matter(raw);
        return {
          slug: file.replace(/\.mdx$/, ""),
          frontmatter: data as HistoryFrontmatter,
        };
      }),
  );
  return articles.sort((a, b) =>
    (b.frontmatter.date ?? "").localeCompare(a.frontmatter.date ?? ""),
  );
}

export async function getHistoryArticle(
  slug: string,
): Promise<HistoryArticle | null> {
  try {
    const raw = await fs.readFile(
      path.join(HISTORY_DIR, `${slug}.mdx`),
      "utf8",
    );
    const { data, content } = matter(raw);
    return {
      slug,
      frontmatter: data as HistoryFrontmatter,
      content,
    };
  } catch {
    return null;
  }
}

export async function historySlugs(): Promise<string[]> {
  const list = await listHistoryArticles();
  return list.map((a) => a.slug);
}
