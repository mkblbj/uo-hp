import test from "node:test";
import assert from "node:assert/strict";
import { Color, expression, validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import type { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";
import upstreamJson from "../fixtures/openfreemap-dark.json" with { type: "json" };
import { themeMapStyle } from "../../.vitepress/theme/utils/mapTheme.ts";

// tiles.openfreemap.org/styles/dark 的快照
const upstream = upstreamJson as StyleSpecification;
const themed = themeMapStyle(structuredClone(upstream));

type AnyLayer = { id: string; type: string; paint?: Record<string, unknown>; layout?: Record<string, unknown> };
const layers = (style: StyleSpecification) => style.layers as AnyLayer[];
const layer = (style: StyleSpecification, id: string): AnyLayer => {
  const found = layers(style).find((item) => item.id === id);
  assert.ok(found, `layer ${id} is missing`);
  return found;
};

const validationErrors = (style: StyleSpecification) => validateStyleMin(style).map((error) => error.message);

test("theming keeps the style valid for MapLibre", () => {
  assert.deepEqual(validationErrors(themed), validationErrors(upstream));
});

// 用 MapLibre 自己的表达式引擎算出某个要素在该图层上显示的文字
const labelOf = (style: StyleSpecification, id: string, properties: Record<string, string>) => {
  const index = layers(style).findIndex((item) => item.id === id);
  const parsed = expression.createExpression(layer(style, id).layout?.["text-field"], `layers[${index}].layout.text-field`);
  assert.equal(parsed.result, "success", id);
  return (parsed.value as { evaluate: (globals: object, feature: object) => unknown }).evaluate(
    { zoom: 15 },
    { type: 1, properties },
  );
};

// 快照里显示地名的图层，按快照手工列出（不复用实现里的判断规则）
const NAME_LAYERS = [
  "water_name",
  "highway_name_other",
  "place_other",
  "place_suburb",
  "place_village",
  "place_town",
  "place_city",
  "place_city_large",
  "place_state",
  "place_country_other",
  "place_country_minor",
  "place_country_major",
];
const WITH_JA = { name: "神戸市", "name:ja": "神戸", "name:latin": "Kobe", "name:nonlatin": "神戸" };
const WITHOUT_JA = { name: "長田区", "name:latin": "Nagata", "name:nonlatin": "長田区" };

test("place and street labels show Japanese names instead of romanized ones", () => {
  for (const id of NAME_LAYERS) {
    assert.equal(labelOf(themed, id, WITH_JA), "神戸", id);
    assert.equal(labelOf(themed, id, WITHOUT_JA), "長田区", id);
  }
});

test("less common color and label syntaxes are themed too", () => {
  const style = {
    version: 8,
    sources: {},
    layers: [
      { id: "slash-alpha", type: "background", paint: { "background-color": "rgb(0 0 0 / 50%)" } },
      { id: "percent", type: "background", paint: { "background-color": "rgb(10%, 10%, 10%)" } },
      { id: "stops", type: "background", paint: { "background-color": { stops: [[10, "#888888"], [15, "#444444"]] } } },
      { id: "token", type: "symbol", source: "x", "source-layer": "place", layout: { "text-field": "{name:latin}" } },
    ],
  } as unknown as StyleSpecification;
  const out = themeMapStyle(style);
  const background = (id: string) => layer(out, id).paint?.["background-color"];
  // 半透明仍是半透明
  assert.equal(Color.parse(background("slash-alpha") as string)?.a, 0.5);
  // 百分比写法按百分比算亮度：10% 的灰提亮后约 11%，不会被当成接近纯黑
  const percent = Color.parse(background("percent") as string);
  assert.ok(percent);
  const lightness = (Math.max(percent.r, percent.g, percent.b) + Math.min(percent.r, percent.g, percent.b)) / 2;
  assert.ok(lightness > 0.08 && lightness < 0.15, `lightness ${lightness}`);
  // 旧式 stops 函数里的颜色也换成深蓝
  for (const [, color] of (background("stops") as { stops: [number, string][] }).stops) {
    const parsed = Color.parse(color);
    assert.ok(parsed && parsed.b > parsed.r, color);
  }
  // 旧式 "{name}" 写法的地名也只显示日文
  assert.equal(labelOf(out, "token", WITHOUT_JA), "長田区");
});

test("the themed map draws no sprite images, which could not take the tint", () => {
  assert.equal(themed.sprite, undefined);
  for (const item of layers(themed)) {
    for (const key of ["background-pattern", "fill-pattern", "line-pattern", "fill-extrusion-pattern"]) {
      assert.equal(item.paint?.[key], undefined, `${item.id} ${key}`);
    }
    assert.equal(item.layout?.["icon-image"], undefined, `${item.id} icon-image`);
  }
});

// 收集所有 *-color 绘制属性里的颜色（包括 interpolate 等表达式里的颜色）
const paintColors = (style: StyleSpecification) => {
  const found: { where: string; color: Color }[] = [];
  const visit = (value: unknown, where: string): void => {
    if (typeof value === "string") {
      const color = Color.parse(value);
      if (color) found.push({ where, color });
    } else if (Array.isArray(value)) {
      value.forEach((item) => visit(item, where));
    } else if (value && typeof value === "object") {
      Object.values(value).forEach((item) => visit(item, where));
    }
  };
  for (const item of layers(style)) {
    for (const [key, value] of Object.entries(item.paint ?? {})) {
      if (key.endsWith("-color")) visit(value, `${item.id} ${key}`);
    }
  }
  return found;
};

test("every map color takes on the site's navy tint", () => {
  const colors = paintColors(themed);
  assert.ok(paintColors(upstream).length > 20);
  assert.equal(colors.length, paintColors(upstream).length);
  for (const { where, color } of colors) {
    const black = color.r === 0 && color.g === 0 && color.b === 0;
    assert.ok(black || color.b > color.r, `${where} is still neutral: ${color.toString()}`);
  }
});

const colorOf = (style: StyleSpecification, id: string, property: string) => {
  const color = Color.parse(layer(style, id).paint?.[property] as string);
  assert.ok(color, `${id} ${property} is not a plain color`);
  return color;
};
const luma = (color: Color) => 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;

test("tinting keeps transparency and the light/dark order of map features", () => {
  assert.equal(
    colorOf(themed, "highway_major_casing", "line-color").a,
    colorOf(upstream, "highway_major_casing", "line-color").a,
  );
  // 水面仍比陆地亮（海岸线看得出来），地名仍比水面亮（看得清）
  assert.ok(luma(colorOf(themed, "water", "fill-color")) > luma(colorOf(themed, "background", "background-color")));
  assert.ok(luma(colorOf(themed, "place_city", "text-color")) > luma(colorOf(themed, "water", "fill-color")));
});
