import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { getHomeContent } from "../../.vitepress/theme/content/homeContent.ts";
import { JA_SECTIONS, getPageNav } from "../../.vitepress/theme/content/pageNav.ts";

const dist = new URL("../../.vitepress/dist/", import.meta.url);
const repo = new URL("../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, dist), "utf8");
const PAGES = JA_SECTIONS.flatMap((section) => section.groups.flat().map((page) => page.path));
const htmlFor = (path: string) => read(`${path.slice(1)}index.html`);

// Vue SSR 输出文本时会转义这些字符
const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 读 Markdown 的 frontmatter（title、description、eyebrow） */
const frontmatter = (path: string): Record<string, string> => {
  const source = readFileSync(new URL(`${path.slice(1)}index.md`, repo), "utf8");
  const match = /^---\n([\s\S]*?)\n---/.exec(source);
  return match ? (parse(match[1]) as Record<string, string>) : {};
};

/** 是否有同时带着这些属性的 <a>（属性顺序不限） */
const hasLink = (html: string, ...attrs: string[]) =>
  new RegExp(`<a${attrs.map((attr) => `(?=[^>]*${escapeRegExp(attr)})`).join("")}[^>]*>`).test(html);

/** 取出第一个匹配的元素，到第一个对应的结束标签为止（只用于里面没有同名标签的元素） */
const block = (html: string, open: RegExp, tag: string) => {
  const start = html.search(open);
  return start < 0 ? "" : html.slice(start, html.indexOf(`</${tag}>`, start) + tag.length + 3);
};

test("the site has been built", () => {
  assert.ok(existsSync(new URL("index.html", dist)), "run `pnpm build` first");
});

test("every Japanese inner page uses the corporate page layout instead of the VitePress docs layout", () => {
  for (const path of PAGES) {
    const html = htmlFor(path);
    assert.match(html, /class="corp corp-page"/, path);
    assert.match(html, /<main[^>]*id="main"/, path);
    assert.match(html, /class="corp-prose"/, path);
    for (const docsClass of ["VPNav", "VPSidebar", "VPDocAside", "VPDocFooter"]) {
      assert.ok(!html.includes(`class="${docsClass}`), `${path} still renders ${docsClass}`);
    }
  }
});

test("the page hero shows breadcrumbs, the eyebrow, the title and the description", () => {
  for (const path of PAGES) {
    const html = htmlFor(path);
    const nav = getPageNav(path)!;
    const { title, description, eyebrow } = frontmatter(path);
    assert.match(html, new RegExp(`<h1 class="page-hero__title"[^>]*>${escapeRegExp(escapeHtml(title))}</h1>`), path);
    assert.match(html, new RegExp(`<p class="page-hero__lead"[^>]*>${escapeRegExp(escapeHtml(description))}</p>`), path);
    assert.ok(html.includes(`</span>${escapeHtml(eyebrow || nav.section.eyebrow)}</p>`), `${path} eyebrow`);
    const crumbs = block(html, /<nav class="page-hero__crumbs"/, "nav");
    assert.ok(crumbs.includes('aria-label="パンくずリスト"'), `${path} breadcrumb label`);
    assert.ok(hasLink(crumbs, 'href="/"'), `${path} breadcrumb home`);
    if (!nav.isSectionTop) assert.ok(hasLink(crumbs, `href="${nav.section.path}"`), `${path} breadcrumb section`);
    assert.match(crumbs, new RegExp(`<span aria-current="page"[^>]*>${escapeRegExp(escapeHtml(title))}</span>`), `${path} current crumb`);
  }
});

test("the section tabs list the section's pages and mark the current one", () => {
  for (const path of PAGES) {
    const tabs = block(htmlFor(path), /<nav class="page-tabs"/, "nav");
    assert.ok(tabs, `${path} has tabs`);
    for (const tab of getPageNav(path)!.tabs) assert.ok(hasLink(tabs, `href="${tab.path}"`), `${path} tab ${tab.path}`);
    assert.ok(hasLink(tabs, `href="${path}"`, 'aria-current="page"'), `${path} marks itself`);
    assert.equal((tabs.match(/aria-current="page"/g) ?? []).length, 1, `${path} marks exactly one tab`);
  }
  const dividers = (path: string) => (block(htmlFor(path), /<nav class="page-tabs"/, "nav").match(/class="page-tabs__divider"/g) ?? []).length;
  assert.equal(dividers("/services/"), 1);
  assert.equal(dividers("/about/"), 0);
});

test("the header links to the inner pages, highlights the current section and sends home-section links through a normal page load", () => {
  const header = block(htmlFor("/about/profile/"), /<header/, "header");
  assert.ok(hasLink(header, 'href="/"'), "logo goes home");
  assert.ok(hasLink(header, 'href="/about/"', 'class="header__nav-link is-active"'));
  assert.ok(hasLink(header, 'href="/services/"', 'class="header__nav-link"'));
  assert.ok(hasLink(header, 'href="/#tech"', 'target="_self"'));
  assert.ok(hasLink(header, 'href="/#contact"', 'target="_self"'));
  assert.ok(!hasLink(header, 'href="/about/"', 'target="_self"'), "page links go through the router");
  const onPerformance = block(htmlFor("/services/performance/"), /<header/, "header");
  assert.ok(hasLink(onPerformance, 'href="/services/performance/"', 'aria-current="page"', "is-active"));
});

test("the language menu and the footer switch to the same page in Chinese and English", () => {
  const html = htmlFor("/about/profile/");
  assert.ok(hasLink(html, 'href="/zh/about/profile/"'));
  assert.ok(hasLink(html, 'href="/en/about/profile/"'));
});

test("the footer marks the current page and its logo goes home", () => {
  const footer = block(htmlFor("/about/profile/"), /<footer/, "footer");
  assert.ok(hasLink(footer, 'href="/about/profile/"', 'aria-current="page"'));
  assert.ok(hasLink(footer, 'href="/"'));
});

test("Chinese and English pages and the 404 page keep the VitePress layout", () => {
  for (const file of ["zh/about/profile/index.html", "en/services/index.html", "zh/services/performance/index.html"]) {
    const html = read(file);
    assert.match(html, /class="VPDoc/, file);
    assert.ok(!html.includes("corp-page"), file);
  }
  assert.ok(!read("404.html").includes("corp-page"));
});

test("section tops end with cards for the other pages of the section, described by their page descriptions", () => {
  for (const top of ["/about/", "/services/"]) {
    const html = htmlFor(top);
    const cards = block(html, /<section class="page-cards"/, "section");
    assert.ok(cards, `${top} has page cards`);
    assert.ok(!html.includes('class="page-pager'), `${top} has no prev/next`);
    for (const card of getPageNav(top)!.sectionPages) {
      assert.ok(hasLink(cards, `href="${card.path}"`, 'class="page-cards__card"'), `${top} card ${card.path}`);
      assert.ok(cards.includes(escapeHtml(frontmatter(card.path).description)), `${top} shows the description of ${card.path}`);
    }
  }
});

test("other pages end with prev / next links in site order", () => {
  for (const path of PAGES.filter((item) => !getPageNav(item)!.isSectionTop)) {
    const nav = getPageNav(path)!;
    const pager = block(htmlFor(path), /<nav class="page-pager/, "nav");
    assert.ok(pager, `${path} has prev/next`);
    if (nav.prev) assert.ok(hasLink(pager, `href="${nav.prev.path}"`), `${path} prev`);
    if (nav.next) assert.ok(hasLink(pager, `href="${nav.next.path}"`), `${path} next`);
    assert.equal(pager.includes("page-pager--single"), !(nav.prev && nav.next), `${path} single-link layout`);
    assert.ok(!htmlFor(path).includes('class="page-cards"'), `${path} has no page cards`);
  }
});

test("the contact section is shared with the homepage and hides a button that points at the current page", () => {
  const { contact } = getHomeContent("ja");
  const ghost = 'class="contact__cta contact__cta--ghost"';
  for (const path of PAGES) {
    const section = block(htmlFor(path), /<section[^>]*id="contact"/, "section");
    assert.ok(section.includes(escapeHtml(contact.title.split("\n")[0])), `${path} contact title`);
    assert.equal(hasLink(section, ghost), path !== contact.secondaryHref, `${path} secondary button`);
  }
});
