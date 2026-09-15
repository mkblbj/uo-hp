import test from "node:test";
import assert from "node:assert/strict";
import { getHomeContent } from "../../.vitepress/theme/content/homeContent.ts";

const strings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
};

test("Chinese homepage uses the detail-page terminology", () => {
  const content = getHomeContent("zh");
  const text = strings(content).join("\n");
  assert.equal(content.hero.titleLine, "贴近日常生活");
  assert.equal(content.business.pillars[0].title, "手机配件业务");
  assert.equal(content.tech.items[2].title, "EC 运营自动化");
  assert.equal(content.performance.channelGroups[3].platform, "跨境协同");
  assert.doesNotMatch(text, /配条|自動化|越境連携|会社概要|署人|生活生活/);
});

test("English homepage has no leftover Japanese UI terminology", () => {
  const text = strings(getHomeContent("en")).join("\n");
  assert.equal(getHomeContent("en").tech.items[2].title, "E-commerce Automation");
  assert.equal(getHomeContent("en").performance.channelGroups[3].platform, "Cross-border Coordination");
  assert.doesNotMatch(text, /自動化|越境連携|会社概要|署人|ランキング/);
});
