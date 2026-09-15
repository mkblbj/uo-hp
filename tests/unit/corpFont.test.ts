import test from "node:test";
import assert from "node:assert/strict";
import { corpFontFamily } from "../../.vitepress/theme/utils/corpFont.ts";

test("Chinese corporate pages use the Simplified Chinese font family", () => {
  assert.match(corpFontFamily("zh"), /Noto Sans SC/);
  assert.doesNotMatch(corpFontFamily("zh"), /Noto Sans JP/);
});

test("English corporate pages use the Latin UI font family", () => {
  assert.match(corpFontFamily("en"), /Manrope/);
});
