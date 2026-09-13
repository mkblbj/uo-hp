import { onBeforeUnmount, onMounted, type Ref } from "vue";

/**
 * 滚动淡入：挂载后才给根节点加 data-rv（CSS 只在有 data-rv 时隐藏 .rv），
 * 所以不开 JS 或开启「减少动态效果」时内容一直可见。
 */
export const useRevealOnScroll = (root: Ref<HTMLElement | null>) => {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const element = root.value;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!element || reduceMotion || !("IntersectionObserver" in window)) {
      return;
    }

    element.setAttribute("data-rv", "");
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    element.querySelectorAll<HTMLElement>(".rv").forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 70}ms`;
      observer?.observe(item);
    });
  });

  onBeforeUnmount(() => observer?.disconnect());
};
