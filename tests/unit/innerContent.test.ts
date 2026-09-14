import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { parse } from "yaml";
import { JA_SECTIONS } from "../../.vitepress/theme/content/pageNav.ts";

const repo = new URL("../../", import.meta.url);
const PAGES = JA_SECTIONS.flatMap((section) => section.groups.flat().map((page) => page.path));

const split = (path: string) => {
  const source = readFileSync(new URL(`${path.slice(1)}index.md`, repo), "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  assert.ok(match, `${path} has frontmatter`);
  return { data: parse(match[1]) as Record<string, string>, body: match[2] };
};
// HTML 注释里的旧图片和「生成画像プロンプト」不算正文
const visibleBody = (path: string) => split(path).body.replace(/<!--[\s\S]*?-->/g, "");

test("inner pages start without a markdown title, because the page hero shows it", () => {
  for (const path of PAGES) assert.ok(!/^# /m.test(visibleBody(path)), path);
});

test("navigation-only blocks and the old badges are gone", () => {
  const removed = [
    "このページでわかること",
    "この事業でわかること",
    "このセクションでわかること",
    "## 関連ページ",
    "## 主なページ",
    "## 関連情報",
    "## 読み進め方",
    "あわせて確認したいページ",
    "事業内容を続けて確認したい方へ",
    "<PerformanceAwardBadges",
  ];
  for (const path of PAGES) {
    for (const text of removed) assert.ok(!visibleBody(path).includes(text), `${path}: ${text}`);
  }
});

test("eyebrow is optional; when a page leaves it blank, the section default is shown instead", () => {
  for (const path of PAGES) {
    const eyebrow = split(path).data.eyebrow;
    assert.ok(eyebrow === undefined || typeof eyebrow === "string", `${path}: eyebrow must be a string when present`);
    if (eyebrow) assert.ok(!/\n/.test(eyebrow), `${path}: eyebrow must not contain a newline`);
  }
});

test("images are self-hosted markdown images that exist and stay small", () => {
  for (const path of PAGES) {
    const body = visibleBody(path);
    assert.ok(!/<img\s/i.test(body), `${path} still has an <img> tag`);
    for (const [, src] of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) {
      assert.match(src, /^\/uploads\//, `${path}: ${src}`);
      const file = new URL(`public${src}`, repo);
      assert.ok(existsSync(file), `${src} is missing`);
      assert.ok(statSync(file).size < 400_000, `${src} is ${statSync(file).size} bytes`);
    }
  }
});

test("no stray space before a Japanese full stop", () => {
  for (const path of PAGES) assert.ok(!/ 。/.test(split(path).body), path);
});

test("the business overview turns its four pillars into cards that link to their pages", () => {
  const cards = /^::: cards\n([\s\S]*?)^:::$/m.exec(visibleBody("/services/"))?.[1] ?? "";
  for (const href of ["./mobile-accessories/", "./domestic-foods/", "./future/", "./oem-wholesale/"]) {
    assert.ok(cards.includes(`](${href})`), href);
  }
});

test("strength headings rely on the automatic section numbers", () => {
  assert.ok(!/^## \d\. /m.test(visibleBody("/services/strengths/")));
});

test("the representative message ends with a signature block", () => {
  assert.match(
    visibleBody("/about/message/"),
    /^::: signature\n代表取締役\n!\[王克兢 署名\]\(\/uploads\/home\/signature\.png\)\n:::$/m,
  );
});
