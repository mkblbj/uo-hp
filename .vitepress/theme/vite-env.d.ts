declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.css";

declare module "*?inline" {
  const src: string;
  export default src;
}

declare module "*?worker&url" {
  const src: string;
  export default src;
}

// markdown-it-container 没有自带类型，只在 .vitepress/markdown/corpMarkdown.ts 里用
declare module "markdown-it-container";
