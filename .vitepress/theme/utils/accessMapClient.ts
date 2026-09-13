import { AttributionControl, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import type { PaddingOptions, StyleSpecification } from "maplibre-gl";
import mapCss from "maplibre-gl/dist/maplibre-gl.css?inline";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { LatLng } from "./accessMap";
import { themeMapStyle } from "./mapTheme";

// 这个模块只在地图区快进入视口时才动态加载，地图程序（压缩传输约 290KB）不进首屏
setWorkerUrl(workerUrl);

// OpenFreeMap：免费、可商用、不需要 key，条件是保留署名
const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
// 先看神户一带，再飞到公司
const OVERVIEW_ZOOM = 11.5;
const DETAIL_ZOOM = 15.2;

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
  /** 从全景飞到公司位置；系统开了「减少动态效果」时 MapLibre 会直接跳过去 */
  flyIn: () => void;
  updatePadding: () => void;
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

export const createAccessMap = async ({ container, target, pin, padding, signal }: AccessMapOptions): Promise<AccessMapHandle> => {
  const response = await fetch(STYLE_URL, { signal });
  if (!response.ok) throw new Error(`map style request failed: ${response.status}`);
  const style = themeMapStyle((await response.json()) as StyleSpecification);
  signal.throwIfAborted();
  injectMapStyles();

  const center: [number, number] = [target.lng, target.lat];
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

  let flown = false;
  let paddingQueued = false;
  const applyPadding = () => {
    const next = padding();
    if (!samePadding(next, map.getPadding())) map.setPadding(next);
  };
  return {
    flyIn: () => {
      if (flown) return;
      flown = true;
      map.flyTo({ center, zoom: DETAIL_ZOOM, padding: padding(), duration: 2800 });
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
  };
};
