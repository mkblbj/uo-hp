import { onBeforeUnmount, onMounted, type Ref } from "vue";
import { formatCountValue, parseCountValue, type CountValue } from "../utils/countValue";

const DURATION_MS = 1400;

/** 带 data-count 的元素进入视野 40% 时，从 0 计数到目标值（静态 HTML 里始终是最终值） */
export const useCountUp = (root: Ref<HTMLElement | null>) => {
  let observer: IntersectionObserver | null = null;
  const frames = new Set<number>();

  onMounted(() => {
    const element = root.value;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!element || reduceMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const targets = new Map<Element, CountValue>();
    element.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
      const value = parseCountValue(node.dataset.count ?? "");
      if (!value) return;
      targets.set(node, value);
      node.textContent = formatCountValue(value, 0);
    });

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const value = targets.get(entry.target);
          if (!entry.isIntersecting || !value) continue;
          observer?.unobserve(entry.target);

          const node = entry.target as HTMLElement;
          const startedAt = performance.now();
          const step = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / DURATION_MS);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = formatCountValue(value, value.target * eased);
            if (progress < 1) frames.add(requestAnimationFrame(step));
          };
          frames.add(requestAnimationFrame(step));
        }
      },
      { threshold: 0.4 },
    );

    targets.forEach((_, node) => observer?.observe(node));
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    frames.forEach((frame) => cancelAnimationFrame(frame));
  });
};
