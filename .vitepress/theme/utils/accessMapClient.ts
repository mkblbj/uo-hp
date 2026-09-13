import { AttributionControl, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import type { ExpressionSpecification, PaddingOptions, StyleSpecification } from "maplibre-gl";
import mapCss from "maplibre-gl/dist/maplibre-gl.css?inline";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import routesData from "../data/accessRoutes.json";
import type { LatLng } from "./accessMap";
import { boundsOf, placesForOffice, type AccessPlace, type AccessRoutesData, type LngLat } from "./accessPlaces";
import { themeMapStyle } from "./mapTheme";
import { flowGradient, revealGradient } from "./routeGlow";

// 这个模块只在地图区快进入视口时才动态加载，地图程序和路线数据（压缩传输约 290KB）都不进首屏
setWorkerUrl(workerUrl);

// OpenFreeMap：免费、可商用、不需要 key，条件是保留署名
const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
// 先看神户一带，再飞到能看全车站和路线的位置（没有路线数据时飞到公司附近）
const OVERVIEW_ZOOM = 11.5;
const DETAIL_ZOOM = 15.2;
const FRAME_MAX_ZOOM = 15.4;
// 路线依次"生长"，之后亮光循环流向办公室；约 30 帧/秒，够流畅也省电
const GROW_MS = 1800;
const STAGGER_MS = 350;
const LOOP_MS = 3000;
const FRAME_MS = 33;
const GLOW_OPACITY = 0.45;
const FADE_IN = { duration: 700, delay: 0 };

const LOCALE_JA: Record<string, string> = {
  "Map.Title": "地図",
  "NavigationControl.ZoomIn": "拡大",
  "NavigationControl.ZoomOut": "縮小",
  "AttributionControl.ToggleAttribution": "出典を表示",
  "CooperativeGesturesHandler.WindowsHelpText": "Ctrl キーを押しながらスクロールすると地図を拡大・縮小できます",
  "CooperativeGesturesHandler.MacHelpText": "⌘ キーを押しながらスクロールすると地図を拡大・縮小できます",
  "CooperativeGesturesHandler.MobileHelpText": "2本の指で地図を動かせます",
};

/** 定位点上方的标签：公司名和 LOGO 图片地址 */
export interface AccessMapPin {
  label: string;
  logo: string;
}

export interface AccessMapOptions {
  container: HTMLElement;
  target: LatLng;
  pin: AccessMapPin;
  /** 被地址卡片挡住的边距，每次移动镜头前重新计算 */
  padding: () => PaddingOptions;
  /** 组件卸载时中止，地图随之销毁 */
  signal: AbortSignal;
}

export interface AccessMapHandle {
  /** 从全景飞到能看全车站和路线的位置，然后开始路线动画；系统开了「减少动态效果」时直接跳过去，路线静态显示 */
  flyIn: () => void;
  updatePadding: () => void;
  /** 地图区离开屏幕时暂停路线动画，回来再继续 */
  setActive: (active: boolean) => void;
}

const span = (className: string, text = "") => Object.assign(document.createElement("span"), { className, textContent: text });

const createPin = ({ label, logo }: AccessMapPin) => {
  const pin = document.createElement("div");
  pin.className = "access-pin";
  pin.setAttribute("aria-hidden", "true");
  const tag = span("access-pin__label");
  tag.append(Object.assign(document.createElement("img"), { className: "access-pin__logo", src: logo, alt: "", width: 18, height: 18 }), label);
  pin.append(span("access-pin__pulse"), span("access-pin__dot"), tag);
  return pin;
};

// 地图程序自带的样式随这个模块按需加载。普通 import 会并进全站共用的 CSS；
// 单独输出成 .css 文件又会被 VitePress 当成全站样式表，所以以文本形式带进来
const injectMapStyles = () => {
  if (document.getElementById("maplibre-styles")) return;
  document.head.append(Object.assign(document.createElement("style"), { id: "maplibre-styles", textContent: mapCss }));
};

const samePadding = (a: PaddingOptions, b: PaddingOptions) =>
  a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;

const routeLayer = (index: number) => `access-route-${index}`;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** 步行路线（先隐藏，动画开始后显示）和车站 / 高速出口的标注（先透明，镜头停下后淡入） */
const addPlaces = (map: MapLibreMap, places: AccessPlace[]) => {
  places.forEach(({ route }, index) => {
    if (!route) return;
    const id = routeLayer(index);
    map.addSource(id, {
      type: "geojson",
      lineMetrics: true,
      data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route.coordinates } },
    });
    map.addLayer({
      id: `${id}-glow`,
      type: "line",
      source: id,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#6fa9de", "line-width": 14, "line-blur": 10, "line-opacity": 0, "line-opacity-transition": { duration: 900, delay: 0 } },
    });
    map.addLayer({
      id,
      type: "line",
      source: id,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-width": 4, "line-gradient": revealGradient(0) },
    });
  });
  map.addSource("access-places", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: places.map(({ name, detail, kind, position }) => ({
        type: "Feature",
        properties: { name, detail, kind },
        geometry: { type: "Point", coordinates: position },
      })),
    },
  });
  map.addLayer({
    id: "access-places",
    type: "circle",
    source: "access-places",
    paint: {
      "circle-radius": 6,
      "circle-color": "#04080c",
      "circle-stroke-width": 2.5,
      // 车站是蓝色圆圈，高速出口是金色圆圈
      "circle-stroke-color": ["match", ["get", "kind"], "car", "rgba(240, 205, 140, 1)", "#9ec8ec"] as ExpressionSpecification,
      "circle-opacity": 0,
      "circle-stroke-opacity": 0,
      "circle-opacity-transition": FADE_IN,
      "circle-stroke-opacity-transition": FADE_IN,
    },
  });
  map.addLayer({
    id: "access-places-label",
    type: "symbol",
    source: "access-places",
    layout: {
      "text-field": ["format", ["get", "name"], {}, "\n", {}, ["get", "detail"], { "font-scale": 0.8 }] as ExpressionSpecification,
      "text-font": ["Noto Sans Regular"],
      "text-size": 13,
      // 优先放在圆点正下方 / 正上方（左右占地少，不容易被地图边缘切掉），放不下再放两侧
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": 1.25,
      "text-justify": "auto",
      "text-line-height": 1.35,
    },
    paint: {
      "text-color": "#eef6fd",
      "text-halo-color": "rgba(3, 5, 7, 0.95)",
      "text-halo-width": 2,
      "text-opacity": 0,
      "text-opacity-transition": FADE_IN,
    },
  });
};

export const createAccessMap = async ({ container, target, pin, padding, signal }: AccessMapOptions): Promise<AccessMapHandle> => {
  const response = await fetch(STYLE_URL, { signal });
  if (!response.ok) throw new Error(`map style request failed: ${response.status}`);
  const style = themeMapStyle((await response.json()) as StyleSpecification);
  signal.throwIfAborted();
  injectMapStyles();

  const center: LngLat = [target.lng, target.lat];
  const map = new MapLibreMap({
    container,
    style,
    center,
    zoom: OVERVIEW_ZOOM,
    // 不拦截页面滚动：电脑上按住 Ctrl 滚轮才缩放，手机上双指才拖动
    cooperativeGestures: true,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: false,
    locale: LOCALE_JA,
    // 日文地名在本地用网站字体绘制
    localIdeographFontFamily: '"Noto Sans JP", sans-serif',
  });
  signal.addEventListener("abort", () => map.remove(), { once: true });
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.setPadding(padding());
  // 控件都放左侧，避开右侧的地址卡片；署名始终展开（免费使用底图的条件）
  map.addControl(new NavigationControl({ showCompass: false }), "top-left");
  map.addControl(new AttributionControl({ compact: false }), "bottom-left");
  new Marker({ element: createPin(pin) }).setLngLat(center).addTo(map);
  await map.once("load");

  const places = placesForOffice((routesData as AccessRoutesData).places, target);
  const routed = places.flatMap((place, index) => (place.route ? [index] : []));
  addPlaces(map, places);

  let paddingQueued = false;
  const applyPadding = () => {
    const next = padding();
    if (!samePadding(next, map.getPadding())) map.setPadding(next);
  };

  // 镜头终点：看全办公室、车站和路线，四周给车站名留出位置
  const frameCamera = () => {
    if (!places.length) return { center, zoom: DETAIL_ZOOM };
    const margin = container.clientWidth > 700 ? { top: 90, bottom: 90, left: 140, right: 90 } : { top: 60, bottom: 50, left: 80, right: 80 };
    const points: LngLat[] = [center, ...places.flatMap((place) => place.route?.coordinates ?? [place.position])];
    return map.cameraForBounds(boundsOf(points), { padding: margin, maxZoom: FRAME_MAX_ZOOM }) ?? { center, zoom: DETAIL_ZOOM };
  };

  // 路线动画
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let flown = false;
  let startedAt = 0;
  let frame = 0;
  let lastPaint = 0;
  let active = true;
  let glowShown = false;

  const showGlow = () => {
    routed.forEach((index) => map.setPaintProperty(`${routeLayer(index)}-glow`, "line-opacity", GLOW_OPACITY));
    glowShown = true;
  };
  const paint = (now: number) => {
    frame = requestAnimationFrame(paint);
    if (now - lastPaint < FRAME_MS) return;
    lastPaint = now;
    const elapsed = now - startedAt;
    routed.forEach((index, order) => {
      const local = elapsed - order * STAGGER_MS;
      const phase = ((local - GROW_MS) % LOOP_MS) / LOOP_MS;
      const gradient =
        local < GROW_MS ? revealGradient(ease(Math.max(0, local) / GROW_MS)) : phase < 0.75 ? flowGradient(phase / 0.75) : revealGradient(1);
      map.setPaintProperty(routeLayer(index), "line-gradient", gradient);
    });
    if (!glowShown && elapsed > GROW_MS) showGlow();
  };
  const run = () => {
    if (active && startedAt && !frame) frame = requestAnimationFrame(paint);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };
  signal.addEventListener("abort", stop, { once: true });

  const startRoutes = () => {
    map.setPaintProperty("access-places", "circle-opacity", 1);
    map.setPaintProperty("access-places", "circle-stroke-opacity", 1);
    map.setPaintProperty("access-places-label", "text-opacity", 1);
    if (reduceMotion) {
      routed.forEach((index) => map.setPaintProperty(routeLayer(index), "line-gradient", revealGradient(1)));
      showGlow();
      return;
    }
    startedAt = performance.now();
    run();
  };

  return {
    flyIn: () => {
      if (flown) return;
      flown = true;
      applyPadding();
      // 先挂监听再移动镜头：「减少动态效果」时 flyTo 会立即跳到终点并同步触发 moveend
      map.once("moveend", startRoutes);
      map.flyTo({ ...frameCamera(), duration: 2800 });
    },
    // setPadding 会打断正在进行的镜头动画（手机地址栏收起时也会触发 resize）：
    // 边距没变就不调用；镜头还在动就等它停下
    updatePadding: () => {
      if (!map.isMoving()) {
        applyPadding();
      } else if (!paddingQueued) {
        paddingQueued = true;
        map.once("moveend", () => {
          paddingQueued = false;
          applyPadding();
        });
      }
    },
    setActive: (value) => {
      active = value;
      if (value) run();
      else stop();
    },
  };
};
