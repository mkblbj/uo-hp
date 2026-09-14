import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { AVAILABLE_PATHS, getLocaleFromPath, getLocalePath } from "../../.vitepress/theme/utils/localePath.ts";

const repo = new URL("../../", import.meta.url);
const DEEP_PAGES = [
  "/about/profile/",
  "/about/message/",
  "/services/mobile-accessories/",
  "/services/domestic-foods/",
  "/services/oem-wholesale/",
  "/services/products/",
  "/services/performance/",
  "/services/strengths/",
  "/services/future/",
];

test("deep Japanese pages switch to the same page in Chinese and English", () => {
  for (const path of DEEP_PAGES) {
    assert.equal(getLocalePath(path, "zh"), `/zh${path}`);
    assert.equal(getLocalePath(path, "en"), `/en${path}`);
  }
});

test("Chinese and English pages switch back to the same Japanese page", () => {
  assert.equal(getLocalePath("/zh/about/profile/", "ja"), "/about/profile/");
  assert.equal(getLocalePath("/en/services/future/", "ja"), "/services/future/");
  assert.equal(getLocalePath("/zh/", "ja"), "/");
  assert.equal(getLocalePath("/", "en"), "/en/");
});

test("unknown pages fall back to their section top", () => {
  assert.equal(getLocalePath("/about/unknown/", "zh"), "/zh/about/");
  assert.equal(getLocalePath("/services/unknown/", "en"), "/en/services/");
  assert.equal(getLocalePath("/unknown/", "zh"), "/zh/");
});

test("the locale comes from the path prefix", () => {
  assert.equal(getLocaleFromPath("/zh/about/"), "zh");
  assert.equal(getLocaleFromPath("/en"), "en");
  assert.equal(getLocaleFromPath("/about/profile/"), "ja");
});

test("every listed page exists as a markdown file", () => {
  for (const [locale, paths] of Object.entries(AVAILABLE_PATHS)) {
    const prefix = locale === "ja" ? "" : `${locale}/`;
    for (const path of paths) {
      const file = `${prefix}${path.replace(/^\//, "")}index.md`;
      assert.ok(existsSync(new URL(file, repo)), `${locale} ${path} -> ${file}`);
    }
  }
});
