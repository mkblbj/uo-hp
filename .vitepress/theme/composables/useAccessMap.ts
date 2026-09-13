import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import type { LatLng } from "../utils/accessMap";
import type { AccessMapHandle, AccessMapPin } from "../utils/accessMapClient";

export type AccessMapStatus = "idle" | "loading" | "ready" | "failed";

interface AccessMapElements {
  section: Ref<HTMLElement | null>;
  container: Ref<HTMLElement | null>;
  card: Ref<HTMLElement | null>;
}

// 和 CorpAccess.vue 的断点一致：电脑版地址卡片盖在地图右侧，窄屏时在地图下方
const CARD_BESIDE_MAP = "(min-width: 1021px)";

/**
 * 地图区离视口还有 600px 时才下载地图程序，首屏不受影响；
 * 地图露出三成后再从神户全景飞到公司位置。坐标无效或加载失败时保留占位图。
 */
export const useAccessMap = ({ section, container, card }: AccessMapElements, target: () => LatLng | null, pin: AccessMapPin) => {
  const status = ref<AccessMapStatus>("idle");
  const controller = new AbortController();
  const observers: IntersectionObserver[] = [];
  let handle: AccessMapHandle | null = null;
  let inView = false;

  // 电脑版把卡片挡住的宽度留作右边距，让定位点落在露出部分的中间
  const padding = () => {
    const map = container.value?.getBoundingClientRect();
    const box = card.value?.getBoundingClientRect();
    const right = map && box && window.matchMedia(CARD_BESIDE_MAP).matches ? Math.max(0, Math.round(map.right - box.left)) : 0;
    return { top: 0, bottom: 0, left: 0, right };
  };

  const load = async () => {
    const element = container.value;
    const spot = target();
    if (status.value !== "idle" || !spot || !element) return;
    status.value = "loading";
    try {
      const { createAccessMap } = await import("../utils/accessMapClient");
      handle = await createAccessMap({ container: element, target: spot, pin, padding, signal: controller.signal });
      status.value = "ready";
      if (inView) handle.flyIn();
    } catch (error) {
      if (controller.signal.aborted) return;
      console.warn("[access map]", error);
      status.value = "failed";
    }
  };

  const observe = (element: HTMLElement, options: IntersectionObserverInit, onEntry: (entry: IntersectionObserverEntry) => void) => {
    const observer = new IntersectionObserver((entries) => entries.forEach(onEntry), options);
    observer.observe(element);
    observers.push(observer);
  };

  const onResize = () => handle?.updatePadding();

  onMounted(() => {
    if (!section.value || !container.value || !target()) return;
    if (!("IntersectionObserver" in window)) {
      inView = true;
      void load();
      return;
    }
    observe(section.value, { rootMargin: "600px 0px" }, (entry) => {
      if (entry.isIntersecting) void load();
    });
    observe(container.value, { threshold: 0.3 }, (entry) => {
      inView = entry.intersectionRatio >= 0.29;
      if (inView) handle?.flyIn();
    });
    window.addEventListener("resize", onResize, { passive: true });
  });

  onBeforeUnmount(() => {
    controller.abort();
    observers.forEach((observer) => observer.disconnect());
    window.removeEventListener("resize", onResize);
  });

  return { status };
};
