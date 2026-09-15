import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createMarkdownRenderer } from "vitepress";
import timeline from "vitepress-markdown-timeline";
import { corpContainers, corpSections, isJaInnerPage } from "../../.vitepress/markdown/corpMarkdown.ts";

// 用 VitePress 真正的 Markdown 渲染器（含它自带的提示框、标题锚点等插件），再加上和 config.ts 一样的插件
const root = fileURLToPath(new URL("../../", import.meta.url));
const md = await createMarkdownRenderer(root, {
  config: (instance) => {
    instance.use(timeline);
    corpContainers(instance);
    corpSections(instance);
  },
});
const render = (src: string, relativePath: string) =>
  md.render(src, { path: `${root}${relativePath}`, relativePath, cleanUrls: true });

const SAMPLE = [
  "<!-- prompt -->",
  "",
  "Lead paragraph.",
  "",
  "## First",
  "",
  "Body one.",
  "",
  "::: info Box",
  "## Inside box",
  ":::",
  "",
  "## Second",
  "",
  "- item",
].join("\n");

test("all localized inner pages are restructured", () => {
  assert.equal(isJaInnerPage("about/profile/index.md"), true);
  assert.equal(isJaInnerPage("services/index.md"), true);
  assert.equal(isJaInnerPage("index.md"), false);
  assert.equal(isJaInnerPage("zh/about/index.md"), true);
  assert.equal(isJaInnerPage("en/services/future/index.md"), true);
  assert.equal(isJaInnerPage(undefined), false);
});

test("the intro and each top-level ## become numbered sections", () => {
  const html = render(SAMPLE, "about/profile/index.md");
  assert.match(html, /<div class="corp-intro">\s*<p>Lead paragraph\.<\/p>\s*<\/div>/);
  assert.ok(html.indexOf("<!-- prompt -->") < html.indexOf('<div class="corp-intro">'), "comment-only blocks stay outside the intro");
  const numbers = [...html.matchAll(/<span class="corp-sec__no" aria-hidden="true">(\d+)<\/span>/g)].map((match) => match[1]);
  assert.deepEqual(numbers, ["01", "02"]);
  assert.match(
    html,
    /<section class="corp-sec">\s*<div class="corp-sec__head"><div class="corp-sec__head-inner"><span class="corp-sec__no" aria-hidden="true">01<\/span>\s*<h2 id="first"[^>]*>First/,
  );
  assert.match(html, /<\/h2>\s*<\/div><\/div>\s*<div class="corp-sec__body">\s*<p>Body one\.<\/p>/);
  assert.match(html, /<h2 id="inside-box"/, "a heading inside a box stays in the box");
  assert.equal((html.match(/<section class="corp-sec">/g) ?? []).length, 2);
  assert.equal((html.match(/<\/section>/g) ?? []).length, 2);
});

test("renderInline does not get wrapped in the section structure", () => {
  const html = md.renderInline("**UO**", { path: `${root}about/index.md`, relativePath: "about/index.md", cleanUrls: true });
  assert.ok(!html.includes("corp-intro"), "renderInline must not add the intro wrapper");
  assert.ok(!html.includes("corp-sec"), "renderInline must not add the section wrapper");
});

test("pages outside localized inner pages are left alone", () => {
  const html = render(SAMPLE, "zh/index.md");
  assert.ok(!html.includes("corp-sec") && !html.includes("corp-intro"));
  assert.match(html, /<p class="custom-block-title">Box<\/p>/);
});

test("untitled boxes drop VitePress's default title on localized inner pages", () => {
  const src = "::: tip\n- a\n:::\n\n::: info Titled\ntext\n:::";
  const ja = render(src, "about/message/index.md");
  assert.ok(!ja.includes(">TIP<"), "no default TIP title");
  assert.match(ja, /<div class="tip custom-block">\s*<ul>/);
  assert.match(ja, /<p class="custom-block-title">Titled<\/p>/);
  const localized = render(src, "zh/about/message/index.md");
  assert.ok(!localized.includes(">TIP<"), "localized inner pages also hide default TIP titles");
});

test("the new blocks render their wrappers and data components", () => {
  const src = [
    "::: cards",
    "- [Card](./a/) body",
    ":::",
    "",
    "::: company-profile",
    "（hint）",
    ":::",
    "",
    "::: sales-results",
    "（hint）",
    ":::",
    "",
    "::: signature",
    "代表取締役",
    "![sig](/s.png)",
    ":::",
  ].join("\n");
  const html = render(src, "services/index.md");
  assert.match(html, /<div class="corp-cards">\s*<ul>/);
  assert.match(html, /<CorpProfileTable>[\s\S]*<\/CorpProfileTable>/);
  assert.match(html, /<CorpSalesResults>[\s\S]*<\/CorpSalesResults>/);
  assert.match(html, /<div class="corp-signature">\s*<p>代表取締役/);
});

test("::: timeline blocks still render inside sections", () => {
  const html = render("## 沿革\n\n::: timeline 2012年\n**原点** 説明\n:::", "about/profile/index.md");
  assert.match(html, /<div class="corp-sec__body">\s*<div class=['"]timeline-dot['"]><span class=['"]timeline-dot-title['"]>2012年<\/span>/);
});
