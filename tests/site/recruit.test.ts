import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

/* 招聘页的构建结果冒烟检查（先 pnpm build） */

const dist = new URL("../../.vitepress/dist/", import.meta.url);
const repo = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, dist), "utf8");
const readJob = (name: string) => JSON.parse(readFileSync(new URL(`data/recruit/jobs/${name}`, repo), "utf8"));
const files = readdirSync(new URL("data/recruit/jobs/", repo)).filter((name) => name.endsWith(".json"));
const slugs = files.map((name) => readJob(name).ja).filter((ja) => ja.published !== false).map((ja) => String(ja.slug));
const PREFIX = { ja: "", zh: "zh/", en: "en/" } as const;

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 是否有同时带着这些属性的 <a>（属性顺序不限） */
const hasLink = (html: string, ...attrs: string[]) => new RegExp(`<a${attrs.map((attr) => `(?=[^>]*${escapeRegExp(attr)})`).join("")}[^>]*>`).test(html);

test("the recruit page and every position page are built in all three languages", () => {
  assert.equal(slugs.length, 9);
  for (const prefix of Object.values(PREFIX)) {
    const top = read(`${prefix}recruit/index.html`);
    assert.match(top, /class="corp corp-recruit"/, prefix);
    assert.equal((top.match(/class="job"/g) ?? []).length, 9, `${prefix} job rows`);
    for (const id of ["positions", "environment", "flow", "faq", "apply"]) assert.ok(top.includes(`id="${id}"`), `${prefix} #${id}`);
    for (const slug of slugs) assert.ok(existsSync(new URL(`${prefix}recruit/${slug}/index.html`, dist)), `${prefix}${slug}`);
  }
});

test("a position page shows its title, conditions and the application section, and leaves out empty optional rows", () => {
  const job = readJob("packing-staff.json");
  for (const [locale, prefix] of Object.entries(PREFIX)) {
    const html = read(`${prefix}recruit/packing-staff/index.html`);
    assert.match(html, new RegExp(`<h1[^>]*>${escapeRegExp(escapeHtml(job[locale].title))}</h1>`), locale);
    assert.ok(html.includes('class="cond"') && html.includes('id="apply"'), locale);
  }
  // 休日・休暇、試用期間 还没填：表格里不出现这两行
  const ja = read("recruit/packing-staff/index.html");
  assert.ok(!ja.includes("休日・休暇") && !ja.includes("試用期間"));
});

test("only Japanese position pages carry a JobPosting for Google job search", () => {
  for (const slug of slugs) {
    const match = /<script type="application\/ld\+json">(.*?)<\/script>/s.exec(read(`recruit/${slug}/index.html`));
    assert.ok(match, slug);
    const posting = JSON.parse(match[1]);
    assert.equal(posting["@type"], "JobPosting", slug);
    for (const key of ["title", "description", "datePosted", "hiringOrganization", "jobLocation"]) assert.ok(posting[key], `${slug} ${key}`);
    assert.equal(posting.jobLocation.address.addressRegion, "兵庫県", slug);
    for (const prefix of ["zh/", "en/"]) assert.ok(!read(`${prefix}recruit/${slug}/index.html`).includes("application/ld+json"), `${prefix}${slug}`);
  }
});

test("the header and footer link to the recruit page, highlighted on recruit pages", () => {
  assert.ok(hasLink(read("index.html"), 'href="/recruit/"'), "homepage header");
  assert.ok(hasLink(read("zh/about/index.html"), 'href="/zh/recruit/"'), "zh inner page");
  const job = read("recruit/packing-staff/index.html");
  assert.ok(hasLink(job, 'class="header__nav-link is-active"', 'href="/recruit/"'), "active on a position page");
  assert.ok(hasLink(read("en/recruit/index.html"), 'class="header__nav-link is-active"', 'href="/en/recruit/"', 'aria-current="page"'), "current on the recruit page");
  assert.ok(hasLink(read("about/index.html"), 'class="footer__link"', 'href="/recruit/"'), "footer link");
});
