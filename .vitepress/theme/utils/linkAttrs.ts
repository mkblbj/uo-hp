import { withBase } from "vitepress";

/** 站内链接加 base；外链新窗口打开；没有网址时返回空对象（组件据此渲染成普通元素） */
export const linkAttrs = (url?: string): Record<string, string> => {
  if (!url) return {};
  if (url.startsWith("/")) return { href: withBase(url) };
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
};

export const isExternalUrl = (url?: string): boolean => Boolean(url && !url.startsWith("/"));
