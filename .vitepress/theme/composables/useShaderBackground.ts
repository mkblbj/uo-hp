import { onMounted, onUnmounted, ref } from "vue";
import { PointerHandler } from "../utils/PointerHandler";
import {
  WebGLRenderer,
  defaultShaderSource,
  mobileShaderSource,
} from "../utils/WebGLRenderer";

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  (window.innerWidth <= 760 ||
    ("ontouchstart" in window && window.innerWidth <= 1024));

export const useShaderBackground = () => {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const isSupported = ref(false);

  let animationFrame: number | null = null;
  let renderer: WebGLRenderer | null = null;
  let pointers: PointerHandler | null = null;
  let mobile = false;
  let frameCount = 0;
  let isVisible = true;
  let resizeObserver: ResizeObserver | null = null;
  let visibilityObserver: IntersectionObserver | null = null;
  let contextLostHandler: (() => void) | null = null;
  let contextRestoredHandler: (() => void) | null = null;

  const getDpr = () => {
    const baseDpr = window.devicePixelRatio || 1;
    return mobile
      ? Math.max(0.75, 0.3 * baseDpr)
      : Math.max(1, 0.5 * baseDpr);
  };

  // 按画布自身的显示尺寸设置绘制缓冲区，避免画布不是整窗大小时画面被拉伸
  const resize = () => {
    const canvas = canvasRef.value;

    if (!canvas) {
      return;
    }

    const dpr = getDpr();
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    renderer?.updateScale(dpr);
    pointers?.updateScale(dpr);
  };

  const stop = () => {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  const loop = (now: number) => {
    if (!renderer || !pointers) {
      return;
    }

    animationFrame = window.requestAnimationFrame(loop);
    frameCount++;

    if (mobile && frameCount % 2 !== 0) {
      return;
    }

    renderer.updateMouse(pointers.first);
    renderer.updatePointerCount(pointers.count);
    renderer.updatePointerCoords(pointers.coords);
    renderer.updateMove(pointers.move);
    renderer.render(now);
  };

  const start = () => {
    if (animationFrame === null && isSupported.value && isVisible) {
      animationFrame = window.requestAnimationFrame(loop);
    }
  };

  const initShader = () => {
    if (!canvasRef.value || !renderer) return;

    const source = mobile ? mobileShaderSource : defaultShaderSource;

    if (renderer.test(source) === null) {
      renderer.updateShader(source);
      isSupported.value = true;
    } else if (mobile && renderer.test(defaultShaderSource) === null) {
      renderer.updateShader(defaultShaderSource);
      isSupported.value = true;
    } else {
      isSupported.value = false;
    }
  };

  onMounted(() => {
    const canvas = canvasRef.value;

    if (!canvas || typeof window === "undefined") {
      return;
    }

    mobile = isMobileViewport();

    if (!canvas.getContext("webgl2")) {
      isSupported.value = false;
      return;
    }

    contextLostHandler = () => {
      isSupported.value = false;
      stop();
    };

    contextRestoredHandler = () => {
      if (!canvasRef.value) return;
      renderer = new WebGLRenderer(canvasRef.value, getDpr());
      pointers = new PointerHandler(canvasRef.value, getDpr());
      renderer.setup();
      renderer.init();
      resize();
      initShader();
      start();
    };

    canvas.addEventListener("webglcontextlost", contextLostHandler);
    canvas.addEventListener("webglcontextrestored", contextRestoredHandler);

    const dpr = getDpr();
    renderer = new WebGLRenderer(canvas, dpr);
    pointers = new PointerHandler(canvas, dpr);

    renderer.setup();
    renderer.init();
    resize();
    initShader();

    // 用 typeof 判断而不是 `in window`：后者会让 TS 把 else 分支里的 window 收窄成 never
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    // 画布滚出视野就停止渲染，回到视野再继续
    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      });
      visibilityObserver.observe(canvas);
    }

    start();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resize);
    resizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    stop();

    if (canvasRef.value) {
      if (contextLostHandler)
        canvasRef.value.removeEventListener("webglcontextlost", contextLostHandler);
      if (contextRestoredHandler)
        canvasRef.value.removeEventListener("webglcontextrestored", contextRestoredHandler);
    }

    renderer?.reset();
  });

  return {
    canvasRef,
    isSupported,
  };
};
