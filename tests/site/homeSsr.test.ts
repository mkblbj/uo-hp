import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { getHomeContent } from "../../.vitepress/theme/content/homeContent.ts";
import { getHomeUi } from "../../.vitepress/theme/content/homeUi.ts";
import { directionsUrl, mapSearchUrl, parseLatLng } from "../../.vitepress/theme/utils/accessMap.ts";

const file = new URL("../../.vitepress/dist/index.html", import.meta.url);
const html = existsSync(file) ? readFileSync(file, "utf8") : "";
const ja = getHomeContent("ja");
const ui = getHomeUi("ja");

// Vue SSR 输出文本时会转义这些字符
const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// 标题类字段里的 \n 会被渲染成 <br>，所以逐行检查
const expectText = (text: string) => {
  for (const line of text.split("\n")) assert.ok(html.includes(escapeHtml(line)), `missing text: ${line}`);
};

test("the homepage renders with the corporate layout", () => {
  assert.ok(html, "run `pnpm build` first");
  assert.match(html, /class="corp"/);
  assert.match(html, /<main[^>]*id="main"/);
  expectText(ui.skipToContent);
});

test("title, description and fonts come from index.md", () => {
  assert.ok(html.includes("<title>株式会社UO | 暮らしに寄り添う価値を。</title>"));
  assert.ok(html.includes("株式会社UOの会社案内サイト。EC運営、OEM・加工・卸売、食品・グローバル特産品、AI・システム開発、日中貿易。"));
  assert.ok(html.includes("family=Noto+Sans+JP:wght@300;400;500;700;900"));
  assert.ok(html.includes("family=Orbitron:wght@400;500;600;700"));
  assert.ok(!html.includes("family=Cormorant+Garamond"));
});

test("placeholder text never reaches the page", () => {
  assert.ok(!html.includes("待補充"));
});

test("header renders brand, anchor navigation and the language menu", () => {
  expectText(ja.brand.name);
  expectText(ja.brand.sub);
  const anchors: [string, string][] = [
    ["#company", ja.nav.company],
    ["#business", ja.nav.business],
    ["#performance", ja.nav.performance],
    ["#tech", ja.nav.tech],
    ["#contact", ja.nav.contact],
  ];
  for (const [anchor, label] of anchors) {
    assert.match(html, new RegExp(`href="${anchor}"[^>]*target="_self"`), anchor);
    expectText(label);
  }
  assert.ok(html.includes(">JA<"), "language code JA is missing");
  assert.match(html, /aria-controls="corp-mobile-nav"/);
});

test("hero renders headline, CTAs, stats and the business panel", () => {
  assert.match(html, /<section[^>]*id="top"/);
  for (const text of [
    ja.hero.kicker,
    ja.hero.kickerSub,
    ja.hero.titleLine,
    ja.hero.titleAccent,
    ja.hero.lead,
    ja.hero.primaryCta,
    ja.hero.secondaryCta,
    ja.hero.panelTitle,
    ja.hero.channelsTitle,
  ]) {
    expectText(text);
  }
  for (const stat of ja.hero.stats) {
    expectText(stat.value);
    expectText(stat.label);
  }
  for (const pillar of ja.business.pillars) {
    expectText(pillar.title);
    expectText(pillar.summary);
  }
  for (const channel of ja.hero.channels) expectText(channel);
  assert.match(html, /<canvas[^>]*class="hero__canvas/);
});

test("trust strip renders countable values and notes", () => {
  for (const item of ja.trust.items) {
    assert.ok(html.includes(`data-count="${escapeHtml(item.value)}"`), item.value);
    expectText(item.label);
  }
  for (const note of ja.trust.notes) expectText(note);
});

test("business section renders every pillar with its link", () => {
  assert.match(html, /<section[^>]*id="business"/);
  expectText(ja.business.title);
  expectText(ja.business.intro);
  for (const pillar of ja.business.pillars) {
    expectText(pillar.body);
    for (const chip of pillar.chips) expectText(chip);
    assert.ok(html.includes(`href="${pillar.href}"`), pillar.href);
  }
});

test("technology section renders its items and links to the future page", () => {
  assert.match(html, /<section[^>]*id="tech"/);
  expectText(ja.tech.title);
  expectText(ja.tech.note);
  for (const item of ja.tech.items) {
    expectText(item.code);
    expectText(item.desc);
  }
  assert.ok(html.includes(`href="${ja.tech.linkHref}"`));
});

test("strengths section renders reasons and core strengths", () => {
  assert.match(html, /<section[^>]*id="strengths"/);
  expectText(ja.strengths.title);
  for (const reason of ja.strengths.reasons) {
    expectText(reason.no);
    expectText(reason.body);
  }
  expectText(ja.strengths.coreTitle);
  for (const item of ja.strengths.core) {
    expectText(item.text);
    expectText(item.category);
  }
});

test("performance section renders results and channels, and hides the empty partner block", () => {
  assert.match(html, /<section[^>]*id="performance"/);
  expectText(ja.performance.title);
  for (const result of ja.performance.results) {
    expectText(result.label);
    expectText(result.value);
  }
  expectText(ja.performance.note);
  for (const group of ja.performance.channelGroups) {
    expectText(group.platform);
    for (const shop of group.shops) expectText(shop);
  }
  assert.ok(html.includes(`href="${ja.performance.linkHref}"`));
  assert.equal(ja.performance.partners.length, 0);
  assert.ok(!html.includes(escapeHtml(ja.performance.partnersTitle)), "partner block must stay hidden while empty");
});

test("company section renders profile, structure image and history", () => {
  assert.match(html, /<section[^>]*id="company"/);
  expectText(ja.company.title);
  for (const row of ja.company.profile) {
    expectText(row.label);
    expectText(row.value);
  }
  assert.ok(html.includes(`src="${ja.company.structureImage}"`));
  expectText(ja.company.structureCaption);
  for (const item of ja.company.history) {
    expectText(item.year);
    expectText(item.desc);
  }
  assert.ok(html.includes(`href="${ja.company.profileLinkHref}"`));
});

test("message section renders the quote, signature and values", () => {
  expectText(ja.message.quote);
  for (const paragraph of ja.message.paragraphs) expectText(paragraph);
  assert.ok(html.includes(`src="${ja.message.signature}"`));
  assert.ok(html.includes(`src="${ja.message.image}"`));
  for (const value of ja.message.values) expectText(value);
  assert.ok(html.includes(`href="${ja.message.linkHref}"`));
});

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("contact section hides empty details and the missing form button", () => {
  assert.match(html, /<section[^>]*id="contact"/);
  expectText(ja.contact.title);
  expectText(ja.contact.body);
  expectText(ja.contact.secondaryLabel);
  assert.ok(html.includes(`href="${ja.contact.secondaryHref}"`));
  assert.equal(ja.contact.formUrl, "");
  assert.ok(!html.includes(escapeHtml(ja.contact.formLabel)), "form button must stay hidden without a form URL");
  assert.ok(!html.includes('href="/contact/"'));
  assert.ok(!html.includes(`>${ui.contactLabels.tel}<`) && !html.includes(`>${ui.contactLabels.email}<`), "empty contact rows must stay hidden");
});

test("footer renders columns, shops, the legal line and language links", () => {
  for (const column of ja.footer.columns) {
    expectText(column.title);
    for (const link of column.links) assert.ok(html.includes(`href="${link.href}"`), link.href);
  }
  for (const shop of ja.footer.shops) {
    expectText(shop.label);
    if (shop.url?.startsWith("https://")) {
      assert.match(html, new RegExp(`href="${escapeRegExp(shop.url)}"[^>]*target="_blank"`), shop.url);
    }
  }
  expectText(ja.footer.copyright);
  assert.equal(ja.footer.privacyUrl, "");
  assert.ok(!html.includes(escapeHtml(ja.footer.privacyLabel)), "privacy link must stay hidden without a URL");
  assert.ok(html.includes('href="/zh/"') && html.includes('href="/en/"'));
});

test("access section renders the address card with the map and route links", () => {
  assert.match(html, /<section[^>]*id="access"/);
  expectText(ja.access.eyebrow);
  expectText(ja.access.title);
  expectText(ja.access.address);
  const target = parseLatLng(ja.access.coordinates);
  const map = mapSearchUrl(target, ja.access.address);
  assert.match(html, new RegExp(`href="${escapeRegExp(escapeHtml(map))}"[^>]*target="_blank"`), map);
  expectText(ja.access.mapLabel);
  const route = directionsUrl(target, ja.access.address);
  assert.ok(html.includes(`href="${escapeHtml(route)}"`), route);
  expectText(ja.access.routeLabel);
});

test("access directions render as a list when every line starts with a bullet", () => {
  const lines = (ja.access.note ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
  const bullets = lines.length > 0 && lines.every((line) => /^[-・]/.test(line));
  for (const line of lines) {
    const text = escapeHtml(bullets ? line.replace(/^[-・]\s*/, "") : line);
    if (bullets) assert.match(html, new RegExp(`<li[^>]*>${escapeRegExp(text)}</li>`), line);
    else assert.ok(html.includes(text), line);
  }
});

test("the footer map link opens the same Google Maps location as the access card", () => {
  expectText(ja.footer.mapLabel);
  const map = escapeHtml(mapSearchUrl(parseLatLng(ja.access.coordinates), ja.access.address));
  const links = html.match(new RegExp(`href="${escapeRegExp(map)}"`, "g")) ?? [];
  assert.equal(links.length, 2, "the access card and the footer should both link to it");
});

test("no Google Maps short links reach the page, since the iPhone Maps app cannot open them", () => {
  assert.ok(!html.includes("maps.app.goo.gl"));
  assert.ok(!html.includes("goo.gl/maps"));
});