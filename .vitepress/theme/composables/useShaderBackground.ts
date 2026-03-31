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
  let contextLostHandler: (() => void) | null = null;
  let contextRestoredHandler: (() => void) | null = null;

  const getDpr = () => {
    const baseDpr = window.devicePixelRatio;
    return mobile
      ? Math.max(0.75, 0.3 * baseDpr)
      : Math.max(1, 0.5 * baseDpr);
  };

  const resize = () => {
    if (!canvasRef.value || typeof window === "undefined") {
      return;
    }

    const canvas = canvasRef.value;
    const dpr = getDpr();

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    renderer?.updateScale(dpr);
    pointers?.updateScale(dpr);
  };

  const loop = (now: number) => {
    if (!renderer || !pointers) {
      return;
    }

    frameCount++;
    if (mobile && frameCount % 2 !== 0) {
      animationFrame = window.requestAnimationFrame(loop);
      return;
    }

    renderer.updateMouse(pointers.first);
    renderer.updatePointerCount(pointers.count);
    renderer.updatePointerCoords(pointers.coords);
    renderer.updateMove(pointers.move);
    renderer.render(now);
    animationFrame = window.requestAnimationFrame(loop);
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
    if (!canvasRef.value || typeof window === "undefined") {
      return;
    }

    mobile = isMobileViewport();
    const canvas = canvasRef.value;
    const dpr = getDpr();
    const gl = canvas.getContext("webgl2");

    if (!gl) {
      isSupported.value = false;
      return;
    }

    contextLostHandler = () => {
      isSupported.value = false;
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    contextRestoredHandler = () => {
      if (!canvasRef.value) return;
      renderer = new WebGLRenderer(canvasRef.value, getDpr());
      pointers = new PointerHandler(canvasRef.value, getDpr());
      renderer.setup();
      renderer.init();
      resize();
      initShader();
      if (isSupported.value) loop(0);
    };

    canvas.addEventListener("webglcontextlost", contextLostHandler);
    canvas.addEventListener("webglcontextrestored", contextRestoredHandler);

    renderer = new WebGLRenderer(canvas, dpr);
    pointers = new PointerHandler(canvas, dpr);

    renderer.setup();
    renderer.init();
    resize();
    initShader();

    loop(0);
    window.addEventListener("resize", resize);
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", resize);
    }

    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
    }

    if (canvasRef.value) {
      if (contextLostHandler)
        canvasRef.value.removeEventListener(
          "webglcontextlost",
          contextLostHandler,
        );
      if (contextRestoredHandler)
        canvasRef.value.removeEventListener(
          "webglcontextrestored",
          contextRestoredHandler,
        );
    }

    renderer?.reset();
  });

  return {
    canvasRef,
    isSupported,
  };
};
