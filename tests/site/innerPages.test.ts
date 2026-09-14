import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { getHomeContent } from "../../.vitepress/theme/content/homeContent.ts";
import { getHomeUi } from "../../.vitepress/theme/content/homeUi.ts";
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

/** 取出第一个匹配的元素，按嵌套层数找配对的结束标签（用于里面还有同名标签的元素，例如 .sales 套着多层 <div>） */
const nestedBlock = (html: string, open: RegExp, tag: string) => {
  const start = html.search(open);
  if (start < 0) return "";
  const tagRe = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, "g");
  tagRe.lastIndex = start;
  let depth = 0;
  for (let match = tagRe.exec(html); match; match = tagRe.exec(html)) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(start, tagRe.lastIndex);
  }
  return "";
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

test("Chinese and English pages keep the VitePress layout", () => {
  for (const file of ["zh/about/profile/index.html", "en/services/index.html", "zh/services/performance/index.html"]) {
    const html = read(file);
    assert.match(html, /class="VPDoc/, file);
    assert.ok(!html.includes("corp-page"), file);
  }
  // 404 页只在浏览器端渲染，构建产物测不到，改用浏览器检查。
});

test("section tops end with cards for the other pages of the section, described by their page descriptions", () => {
  for (const top of ["/about/", "/services/"]) {
    const html = htmlFor(top);
    const cards = block(html, /<section class="page-cards"/, "section");
    assert.ok(cards, `${top} has page cards`);
    assert.ok(!html.includes('class="page-pager'), `${top} has no prev/next`);
    const ui = getHomeUi("ja");
    assert.ok(cards.includes(escapeHtml(ui.pagesEyebrow)), `${top} shows the pages eyebrow`);
    assert.ok(cards.includes(escapeHtml(ui.pagesTitle.replace("{section}", getPageNav(top)!.section.label))), `${top} shows the section's pages title`);
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

test("the company profile table comes from the homepage data, and the diagram is gone", () => {
  const html = htmlFor("/about/profile/");
  for (const row of getHomeContent("ja").company.profile) {
    assert.ok(html.includes(`<td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.value)}</td>`), row.label);
  }
  assert.ok(!html.includes('class="mermaid"'), "the simple timeline diagram is gone");
  assert.equal((html.match(/class="timeline-dot"/g) ?? []).length, 9);
  assert.ok(!html.includes("这里会自动显示"), "the editor hint stays out of the page");
});

test("sales results come from the homepage data; years are not animated", () => {
  const html = htmlFor("/services/performance/");
  // label（例如「出店開始」）在正文里也会出现，所以只在 .sales 组件片段内检查，不靠整页 includes 碰巧通过
  const sales = nestedBlock(html, /<div class="sales"/, "div");
  assert.ok(sales, "has the sales results block");
  const { performance } = getHomeContent("ja");
  for (const result of performance.results) {
    assert.ok(sales.includes(escapeHtml(result.label)), result.label);
    assert.ok(sales.includes(escapeHtml(result.value)), result.value);
    assert.equal(sales.includes(`data-count="${escapeHtml(result.value)}"`), !/^\d{4}年/.test(result.value), result.value);
  }
  assert.ok(sales.includes(escapeHtml(performance.note)));
  assert.ok(!html.includes("performance-badges"), "the gold badges are gone");
  assert.ok(!html.includes("这里会自动显示"), "the editor hint stays out of the page");
  assert.ok(read("zh/services/performance/index.html").includes("performance-badges"), "Chinese keeps its badges");
});

test("inner pages no longer show external images, markdown titles or navigation-only blocks", () => {
  for (const path of PAGES) {
    const html = htmlFor(path);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${path} has exactly one h1`);
    for (const host of ["pic.x-yue.top", "image.rakuten.co.jp"]) assert.ok(!html.includes(host), `${path} uses ${host}`);
    for (const text of ["このページでわかること", "この事業でわかること", "このセクションでわかること", "関連ページ", "読み進め方"]) {
      assert.ok(!html.includes(text), `${path}: ${text}`);
    }
  }
});

test("the business overview shows its four pillars as linked cards", () => {
  const cards = block(htmlFor("/services/"), /<div class="corp-cards"/, "ul");
  for (const href of ["./mobile-accessories/", "./domestic-foods/", "./future/", "./oem-wholesale/"]) {
    assert.ok(hasLink(cards, `href="${href}"`), href);
  }
});

test("the representative message uses local images, a signature block and no default TIP title", () => {
  const html = htmlFor("/about/message/");
  assert.ok(html.includes('src="/uploads/home/message.webp"'));
  assert.match(html, /<div class="corp-signature">[\s\S]*?src="\/uploads\/home\/signature\.png"/);
  assert.ok(!html.includes(">TIP</p>"));
});
