import { withBase } from "vitepress";

/** 站内链接加 base；外链新窗口打开；没有网址时返回空对象（组件据此渲染成普通元素） */
export const linkAttrs = (url?: string): Record<string, string> => {
  if (!url) return {};
  if (url.startsWith("/")) return { href: withBase(url) };
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
};

export const isExternalUrl = (url?: string): boolean => Boolean(url && !url.startsWith("/"));

/**
 * 页头、页脚里的站内导航链接。带「#」的（首页里的区块）加 target="_self"：
 * VitePress 路由会跳过带 target 的链接，交给浏览器普通跳转，落点由 .corp [id] 的 scroll-margin-top 控制
 */
export const navLinkAttrs = (href: string): Record<string, string> => ({
  href: href.startsWith("/") ? withBase(href) : href,
  ...(href.includes("#") ? { target: "_self" } : {}),
});
