import type { StyleSpecification } from "maplibre-gl";

type Role = { lift: number; saturation: number };

// 网站主色 #185f9f / #6fa9de 的色相
const HUE = 210;

// 线条（道路、铁路）提亮多一些更好辨认；文字饱和度低一些更柔和；其余（陆地、水面、建筑）只轻微提亮
const ROLES: Record<string, Role> = {
  "line-color": { lift: 1.45, saturation: 40 },
  "text-color": { lift: 1.3, saturation: 28 },
};
const DEFAULT_ROLE: Role = { lift: 1.1, saturation: 40 };

// 雪碧图里的图标和纹理是灰色的，没法调色
const PATTERN_KEYS = ["background-pattern", "fill-pattern", "line-pattern", "fill-extrusion-pattern"];

/** 优先 name:ja；没有时用当地文字（在日本就是日文），不再显示罗马字。每个图层各用一份 */
const japaneseLabel = () => ["coalesce", ["get", "name:ja"], ["get", "name:nonlatin"], ["get", "name"]];

/** 文字是否显示地名：表达式里的 ["get", "name…"]，或旧式 "{name…}" 写法 */
const showsName = (textField: unknown) => /"name|\{name/.test(JSON.stringify(textField ?? ""));

const lightnessOfRgb = (channels: number[]) => ((Math.max(...channels) + Math.min(...channels)) / 2 / 255) * 100;

/** 读出颜色的 HSL 亮度（0-100）和透明度；不是颜色（比如表达式里的 "zoom"）时返回 null */
const lightnessOf = (text: string): { lightness: number; alpha: number } | null => {
  const value = text.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((digit) => digit + digit) : hex[1].match(/../g) ?? [];
    return { lightness: lightnessOfRgb(digits.map((pair) => parseInt(pair, 16))), alpha: 1 };
  }
  const call = /^(rgb|hsl)a?\(([^)]*)\)$/.exec(value);
  if (!call) return null;
  // 「rgb(1, 2, 3)」和「rgb(1 2 3 / 50%)」两种写法都认，带 % 的按百分比换算
  const parts = call[2].split(/[\s,/]+/).filter(Boolean);
  const numbers = parts.map(parseFloat);
  if (numbers.length < 3 || numbers.some(Number.isNaN)) return null;
  const isPercent = (index: number) => parts[index].endsWith("%");
  const alpha = parts.length > 3 ? (isPercent(3) ? numbers[3] / 100 : numbers[3]) : 1;
  if (call[1] === "hsl") return { lightness: numbers[2], alpha };
  const channels = [0, 1, 2].map((index) => (isPercent(index) ? numbers[index] * 2.55 : numbers[index]));
  return { lightness: lightnessOfRgb(channels), alpha };
};

/** 保留明暗顺序和透明度，把颜色换成网站的深蓝色调；表达式和旧式 stops 函数里的颜色也一起换 */
const tint = (value: unknown, role: Role): unknown => {
  if (Array.isArray(value)) return value.map((item) => tint(item, role));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tint(item, role)]));
  }
  if (typeof value !== "string") return value;
  const parsed = lightnessOf(value);
  if (!parsed) return value;
  // 最亮只到 90%，否则提亮后变成纯白，就没有蓝色调了
  const lightness = Math.min(90, Math.round(parsed.lightness * role.lift * 10) / 10);
  return `hsla(${HUE}, ${role.saturation}%, ${lightness}%, ${parsed.alpha})`;
};

/** 把 OpenFreeMap 深色底图调成网站的深蓝色调，地名只显示日文，并去掉调不了色的图标和纹理 */
export const themeMapStyle = (style: StyleSpecification): StyleSpecification => {
  const themed = structuredClone(style);
  delete themed.sprite;
  themed.layers = themed.layers.filter((layer) => {
    const paint = (layer as { paint?: Record<string, unknown> }).paint ?? {};
    for (const key of PATTERN_KEYS) delete paint[key];
    for (const key of Object.keys(paint)) {
      if (key.endsWith("-color")) paint[key] = tint(paint[key], ROLES[key] ?? DEFAULT_ROLE);
    }
    const layout = (layer as { layout?: Record<string, unknown> }).layout;
    if (layer.type !== "symbol" || !layout) return true;
    delete layout["icon-image"];
    if (showsName(layout["text-field"])) {
      layout["text-field"] = japaneseLabel();
      delete layout["text-transform"];
    }
    // 只有图标没有文字的图层（单行道箭头）已经没东西可画了
    return layout["text-field"] !== undefined;
  });
  return themed;
};
