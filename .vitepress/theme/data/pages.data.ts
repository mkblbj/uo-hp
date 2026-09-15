import { createContentLoader } from "vitepress";

/** 日文内页的标题、描述、英文小标题：构建时从 Markdown 的 frontmatter 读取，给栏目首页的各页卡片用 */
export interface PageMeta {
  url: string;
  title: string;
  description: string;
  eyebrow: string;
}

declare const data: PageMeta[];
export { data };

export default createContentLoader(["about/**/*.md", "services/**/*.md", "zh/about/**/*.md", "zh/services/**/*.md", "en/about/**/*.md", "en/services/**/*.md"], {
  transform: (raw): PageMeta[] =>
    raw.map(({ url, frontmatter }) => ({
      url,
      title: String(frontmatter.title ?? ""),
      description: String(frontmatter.description ?? ""),
      eyebrow: String(frontmatter.eyebrow ?? ""),
    })),
});
