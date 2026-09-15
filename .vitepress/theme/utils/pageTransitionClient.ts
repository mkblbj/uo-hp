import { nextTick } from "vue";
import { inBrowser, type Router } from "vitepress";
import { asyncLayoutLoaders } from "../layouts/asyncLayouts";
import { pageKey, shouldAnimatePageChange } from "./pageTransition";

/**
 * 站内换页的淡入淡出（浏览器的 View Transitions）：先截下旧页面，等 VitePress 换好新页面再播放。
 * 动画样式在 styles/page-transition.css；切换语言这类整页加载的动画也在那里（@view-transition）。
 */

// 新页面最多等这么久，超时就直接显示，不让画面一直停在旧页面
const MAX_WAIT_MS = 1500;

// 最近一次后退/前进时，浏览器是不是自己在播动画（iPhone 手势滑动返回）。
// 在模块加载时登记：主题比 VitePress 的路由先加载，这个监听排在路由自己的前面，换页钩子读到的就是这一次的值
let browserAnimating = false;
if (inBrowser) {
  window.addEventListener("popstate", (event) => {
    browserAnimating = event.hasUAVisualTransition === true;
  });
}

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export const installPageTransitions = (router: Router) => {
  if (!inBrowser) return;

  // VitePress 挂载前会先走一遍换页流程（首次加载），那一次不播放
  let firstLoadDone = false;
  // 正在等新页面的动画：to 是目标网址，release 调用后开始播放
  let pending: { to: string; release: () => void } | null = null;

  const startTransition = (to: string) =>
    new Promise<void>((captured) => {
      // 上一个动画还在等（很快又点了别的链接）：先放行它，浏览器会直接跳过
      pending?.release();
      const pageReady = new Promise<void>((resolve) => {
        const release = () => {
          window.clearTimeout(timer);
          if (pending?.release === release) pending = null;
          resolve();
        };
        const timer = window.setTimeout(release, MAX_WAIT_MS);
        pending = { to, release };
      });
      // 保险：万一浏览器迟迟不回调，也不卡住换页
      window.setTimeout(captured, MAX_WAIT_MS);
      document
        .startViewTransition(() => {
          captured();
          return pageReady;
        })
        // 动画被跳过（没播完又点了别的链接等）时不在控制台报错
        .ready.catch(() => undefined);
    });

  const beforeRouteChange = router.onBeforeRouteChange;
  router.onBeforeRouteChange = (to) => {
    // 点链接换页才会走这里，后退/前进不会；这时浏览器没有自己的动画
    browserAnimating = false;
    return beforeRouteChange?.(to);
  };

  const afterPageLoad = router.onAfterPageLoad;
  router.onAfterPageLoad = async (to) => {
    await afterPageLoad?.(to);
    // 这时新页面的程序已下载好、画面还是旧页面：截下旧画面再继续换页
    const animate =
      firstLoadDone &&
      shouldAnimatePageChange({
        supported: typeof document.startViewTransition === "function",
        reducedMotion: prefersReducedMotion(),
        hidden: document.visibilityState === "hidden",
        browserAnimating,
        from: router.route.path,
        to,
      });
    if (animate) await startTransition(to);
  };

  const afterRouteChange = router.onAfterRouteChange ?? router.onAfterRouteChanged;
  router.onAfterRouteChange = async (to) => {
    await afterRouteChange?.(to);
    if (!firstLoadDone) {
      firstLoadDone = true;
      return;
    }
    if (!pending || pageKey(pending.to) !== pageKey(to)) return;
    // 招聘页的布局是按需下载的：等它画出来再播放，免得淡入一个空白页
    const loadLayout = asyncLayoutLoaders[String(router.route.data.frontmatter.layout)];
    if (loadLayout) {
      await loadLayout();
      await new Promise((resolve) => window.setTimeout(resolve));
    }
    await nextTick();
    if (pending && pageKey(pending.to) === pageKey(to)) pending.release();
  };
};
