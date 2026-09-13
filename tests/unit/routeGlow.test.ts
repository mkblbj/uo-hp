import test from "node:test";
import assert from "node:assert/strict";
import { Color, expression, latest } from "@maplibre/maplibre-gl-style-spec";
import { flowGradient, revealGradient } from "../../.vitepress/theme/utils/routeGlow.ts";

// 用 MapLibre 自己的表达式引擎编译并计算 line-gradient
const compile = (value: unknown) => {
  const parsed = expression.createExpression(value, "layers[0].paint.line-gradient", latest.paint_line["line-gradient"]);
  assert.equal(parsed.result, "success", JSON.stringify(parsed.value));
  return parsed.value as { evaluate: (globals: object) => Color };
};
const alphaAt = (value: unknown, progress: number) => compile(value).evaluate({ zoom: 15, lineProgress: progress }).a;

test("growth and flow gradients stay valid MapLibre expressions at every step", () => {
  for (let step = 0; step <= 200; step++) {
    compile(revealGradient(step / 200));
    compile(flowGradient(step / 200));
  }
});

test("a growing route only shows the part already travelled from the station", () => {
  assert.equal(alphaAt(revealGradient(0), 0.5), 0);
  const halfway = revealGradient(0.5);
  assert.ok(alphaAt(halfway, 0.3) > 0.5, "the travelled part is visible");
  assert.equal(alphaAt(halfway, 0.7), 0, "the part ahead is still hidden");
  assert.ok(alphaAt(revealGradient(1), 0.99) > 0.5, "a finished route is visible end to end");
});

// 沿路线采样，找出最亮的位置（0 是车站，1 是办公室）
const brightestAt = (value: unknown) => {
  const ramp = compile(value);
  let best = 0;
  let bestLight = -1;
  for (let step = 0; step <= 100; step++) {
    const color = ramp.evaluate({ zoom: 15, lineProgress: step / 100 });
    const light = color.r + color.g + color.b;
    if (light > bestLight) {
      bestLight = light;
      best = step / 100;
    }
  }
  return best;
};

test("the flowing light travels toward the office", () => {
  assert.ok(brightestAt(flowGradient(0.2)) < brightestAt(flowGradient(0.8)));
  assert.ok(brightestAt(flowGradient(0.8)) > 0.7, "late in each loop the light is near the office");
});
