import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { getHomeContent } from "../../.vitepress/theme/content/homeContent.ts";
import { getHomeUi } from "../../.vitepress/theme/content/homeUi.ts";
import { parseLatLng } from "../../.vitepress/theme/utils/accessMap.ts";
import { parseCountValue } from "../../.vitepress/theme/utils/countValue.ts";

const repo = new URL("../../", import.meta.url);
const ja = getHomeContent("ja");

// 深度遍历内容，把每个字符串连同它所在的字段名交给 visit
const walk = (value: unknown, visit: (key: string, text: string) => void, key = ""): void => {
  if (typeof value === "string") {
    visit(key, value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit, key));
  } else if (value && typeof value === "object") {
    for (const [childKey, child] of Object.entries(value)) walk(child, visit, childKey);
  }
};

const collect = (matches: (key: string) => boolean): string[] => {
  const found: string[] = [];
  walk(ja, (key, text) => {
    if (matches(key) && text) found.push(text);
  });
  return found;
};

const isLinkKey = (key: string) => /href$/i.test(key) || key === "url" || /Url$/.test(key);

test("zh and en use their own translated content", () => {
  assert.notEqual(getHomeContent("zh"), ja);
  assert.notEqual(getHomeContent("en"), ja);
  assert.equal(getHomeUi("en").skipToContent, "Skip to content");
  assert.equal(getHomeUi("zh").skipToContent, "跳转到正文");
});

test("content never contains placeholder text", () => {
  assert.ok(!JSON.stringify(ja).includes("待補充"));
});

test("internal links point at existing pages", () => {
  const internal = collect(isLinkKey).filter((href) => href.startsWith("/"));
  assert.ok(internal.length > 10, `only ${internal.length} internal links`);
  for (const href of internal) {
    const path = href.split("#")[0];
    const file = path === "/" ? "index.md" : `${path.replace(/^\//, "")}index.md`;
    assert.ok(existsSync(new URL(file, repo)), `${href} -> ${file}`);
  }
});

test("external links use https", () => {
  for (const url of collect(isLinkKey)) {
    if (!url.startsWith("/")) assert.match(url, /^https:\/\//, url);
  }
});

test("images are self-hosted, exist and stay small", () => {
  const images = collect((key) => /^image$|Image$|^signature$|^logo$/.test(key));
  assert.equal(images.length, 3);
  for (const src of images) {
    assert.match(src, /^\/uploads\/home\//, src);
    const file = new URL(`public${src}`, repo);
    assert.ok(existsSync(file), `${src} is missing`);
    assert.ok(statSync(file).size < 400_000, `${src} is ${statSync(file).size} bytes`);
  }
});

test("trust values can be animated", () => {
  for (const item of ja.trust.items) assert.ok(parseCountValue(item.value), item.value);
});

test("every business pillar has the fields the hero panel and cards need", () => {
  assert.equal(ja.business.pillars.length, 4);
  for (const pillar of ja.business.pillars) {
    assert.ok(pillar.summary && pillar.body && pillar.chips.length > 0, pillar.title);
  }
});

test("the access map points at valid coordinates", () => {
  assert.ok(parseLatLng(ja.access.coordinates), `invalid coordinates: ${ja.access.coordinates}`);
});
