import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JA_SECTIONS } from "../../.vitepress/theme/content/pageNav.ts";

const read = (path: string) => readFileSync(new URL(`../../.vitepress/dist/${path}index.html`, import.meta.url), "utf8");
const pages = JA_SECTIONS.flatMap((section) => section.groups.flat().map((page) => page.path.slice(1)));

for (const locale of ["zh", "en"]) {
  test(`${locale} homepage uses the same sections and assets as Japanese`, () => {
    const ja = read("");
    const html = read(`${locale}/`);
    assert.match(html, /class="corp"/);
    for (const id of ["top", "business", "tech", "strengths", "performance", "company", "contact", "access"]) {
      assert.ok(html.includes(`id="${id}"`), id);
    }
    assert.ok(html.includes('src="/uploads/home/message.webp"'));
    assert.ok(html.includes(`href="/${locale}/about/profile/"`));
    assert.equal((html.match(/class="pillar"/g) ?? []).length, (ja.match(/class="pillar"/g) ?? []).length);
  });

  test(`${locale} inner pages preserve the Japanese page structure and local assets`, () => {
    for (const path of pages) {
      const ja = read(path);
      const html = read(`${locale}/${path}`);
      assert.match(html, /class="corp corp-page"/, path);
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, path);
      assert.equal((html.match(/class="corp-sec"/g) ?? []).length, (ja.match(/class="corp-sec"/g) ?? []).length, path);
      assert.ok(html.includes(`href="/${locale}/"`), `${path} home`);
      assert.ok(!html.includes("pic.x-yue.top") && !html.includes("image.rakuten.co.jp"), path);
    }
  });
}
