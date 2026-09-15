/**
 * 站内换页动画：什么时候播放。纯函数，测试可以直接导入；
 * 接到 VitePress 换页流程上的部分在 pageTransitionClient.ts
 */
export interface PageChange {
  /** 浏览器有 document.startViewTransition */
  supported: boolean;
  /** 系统开了「减少动态效果」 */
  reducedMotion: boolean;
  /** 页面在后台（切到了别的标签页） */
  hidden: boolean;
  /** 浏览器自己在播返回动画（iPhone 手势滑动返回），再叠一层会闪 */
  browserAnimating: boolean;
  from: string;
  to: string;
}

/** 只比较是哪一页：不看 #、?，/about/index.html、/about/、/about 算同一页 */
export const pageKey = (href: string) =>
  new URL(href, "http://a.com").pathname
    .replace(/\/index(?:\.html)?$/, "/")
    .replace(/\.html$/, "")
    .replace(/\/+$/, "") || "/";

export const shouldAnimatePageChange = (change: PageChange) =>
  change.supported &&
  !change.reducedMotion &&
  !change.hidden &&
  !change.browserAnimating &&
  // 同一页里锚点之间的后退/前进不算换页
  pageKey(change.from) !== pageKey(change.to);
