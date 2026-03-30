import { onMounted, onUnmounted, ref } from "vue";
import { PointerHandler } from "../utils/PointerHandler";
import { WebGLRenderer, defaultShaderSource } from "../utils/WebGLRenderer";

export const useShaderBackground = () => {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const isSupported = ref(false);

  let animationFrame: number | null = null;
  let renderer: WebGLRenderer | null = null;
  let pointers: PointerHandler | null = null;

  const resize = () => {
    if (!canvasRef.value || typeof window === "undefined") {
      return;
    }

    const canvas = canvasRef.value;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    renderer?.updateScale(dpr);
    pointers?.updateScale(dpr);
  };

  const loop = (now: number) => {
    if (!renderer || !pointers) {
      return;
    }

    renderer.updateMouse(pointers.first);
    renderer.updatePointerCount(pointers.count);
    renderer.updatePointerCoords(pointers.coords);
    renderer.updateMove(pointers.move);
    renderer.render(now);
    animationFrame = window.requestAnimationFrame(loop);
  };

  onMounted(() => {
    if (!canvasRef.value || typeof window === "undefined") {
      return;
    }

    const canvas = canvasRef.value;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    const gl = canvas.getContext("webgl2");

    if (!gl) {
      isSupported.value = false;
      return;
    }

    renderer = new WebGLRenderer(canvas, dpr);
    pointers = new PointerHandler(canvas, dpr);

    renderer.setup();
    renderer.init();
    resize();

    if (renderer.test(defaultShaderSource) === null) {
      renderer.updateShader(defaultShaderSource);
      isSupported.value = true;
    } else {
      isSupported.value = false;
    }

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

    renderer?.reset();
  });

  return {
    canvasRef,
    isSupported,
  };
};
