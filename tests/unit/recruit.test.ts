import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import {
  firstLine,
  groupByCategory,
  mailtoHref,
  normalizeJobs,
  normalizePage,
  paragraphs,
} from "../../.vitepress/theme/content/recruitData.ts";
import { jobPostingJsonLd, jsonLdScript, parseJpAddress } from "../../.vitepress/theme/content/recruitJsonLd.ts";

const repo = new URL("../../", import.meta.url);
const readJson = (path: string): unknown => JSON.parse(readFileSync(new URL(path, repo), "utf8"));
const jobFiles = readdirSync(new URL("data/recruit/jobs/", repo))
  .filter((name) => name.endsWith(".json"))
  .map((name) => ({ name, data: readJson(`data/recruit/jobs/${name}`) }));

const ORDER = [
  "packing-staff",
  "warehouse-manager",
  "packing-leader",
  "amazon-operations",
  "rakuten-operations",
  "amazon-english-operations",
  "ec-site-operations",
  "ec-designer",
  "design-manager",
];

test("the nine positions load in category order, numbered 01-09, identically in all three languages", () => {
  const { jobs, warnings } = normalizeJobs(jobFiles);
  assert.deepEqual(warnings, []);
  for (const locale of ["ja", "zh", "en"] as const) {
    assert.deepEqual(jobs[locale].map((job) => job.slug), ORDER, locale);
    assert.deepEqual(jobs[locale].map((job) => job.no), ["01", "02", "03", "04", "05", "06", "07", "08", "09"], locale);
  }
  assert.deepEqual(groupByCategory(jobs.ja).map((group) => [group.category, group.jobs.length]), [
    ["logistics", 3],
    ["operations", 4],
    ["design", 2],
  ]);
  assert.equal(jobs.zh[0].title, "网店商品打包・轻作业人员");
  assert.equal(jobs.en[7].sections[0].title, "How We Use AI");
});

test("shared fields come from Japanese, and missing translations fall back to Japanese with a warning", () => {
  const { jobs, warnings } = normalizeJobs([
    {
      name: "sample.json",
      data: {
        ja: { slug: "sample", category: "design", order: 2, employmentTypes: ["parttime", "fulltime"], datePosted: "2026-09-15T00:00", title: "日本語", summary: "要約" },
        zh: { slug: "ignored", category: "logistics", title: "中文" },
      },
    },
  ]);
  const zh = jobs.zh[0];
  assert.equal(zh.slug, "sample");
  assert.equal(zh.category, "design");
  // 雇用形态按固定顺序排列，日期只保留年月日
  assert.deepEqual(zh.employmentTypes, ["fulltime", "parttime"]);
  assert.equal(zh.datePosted, "2026-09-15");
  assert.equal(zh.title, "中文");
  assert.equal(zh.summary, "要約");
  assert.ok(warnings.some((warning) => warning.includes('"summary" has no zh text')));
  assert.equal(jobs.en[0].title, "日本語");
});

test("unpublished, invalid and duplicate positions are left out", () => {
  const job = (slug: string, extra: Record<string, unknown> = {}) => ({ ja: { slug, category: "logistics", employmentTypes: ["fulltime"], title: slug, ...extra } });
  const { jobs, warnings } = normalizeJobs([
    { name: "a.json", data: job("kept", { order: 1 }) },
    { name: "b.json", data: job("hidden", { published: false }) },
    { name: "c.json", data: job("Bad Slug") },
    { name: "d.json", data: job("kept", { order: 2 }) },
    { name: "e.json", data: job("no-category", { category: "sales" }) },
  ]);
  assert.deepEqual(jobs.ja.map((item) => item.slug), ["kept"]);
  // 另外还有「中英文缺职位名、用日文补上」的提示，这里只数被跳过的
  assert.equal(warnings.filter((warning) => warning.endsWith("skipped")).length, 3);
});

test("the recruit page keeps contact details shared across the three languages", () => {
  const { page, warnings } = normalizePage(readJson("data/recruit/page.json"));
  assert.deepEqual(warnings, []);
  for (const locale of ["ja", "zh", "en"] as const) {
    // 邮箱、微信号在后台只填一次（日文），中英文页面显示同一份
    assert.equal(page[locale].email, page.ja.email, locale);
    assert.equal(page[locale].wechatId, page.ja.wechatId, locale);
    // 选考流程、常见问题的条数可以在后台增减，三种语言要一致
    assert.equal(page[locale].steps.length, page.ja.steps.length, locale);
    assert.equal(page[locale].faq.length, page.ja.faq.length, locale);
    assert.ok(page[locale].steps.length > 0 && page[locale].faq.length > 0, locale);
    assert.ok(page[locale].lead && page[locale].locationShort, locale);
  }
});

test("text helpers split paragraphs, take the first line and build the mail link", () => {
  assert.deepEqual(paragraphs("一段目\n\n二段目\n  \n三段目"), ["一段目", "二段目", "三段目"]);
  assert.equal(firstLine("時給：経験・能力を考慮\n1,200円～"), "時給：経験・能力を考慮");
  assert.equal(mailtoHref("jobs@example.jp", "【応募】梱包 & 発送"), "mailto:jobs@example.jp?subject=%E3%80%90%E5%BF%9C%E5%8B%9F%E3%80%91%E6%A2%B1%E5%8C%85%20%26%20%E7%99%BA%E9%80%81");
});

test("the office address splits into the parts Google expects", () => {
  const home = readJson("data/home/ja.json") as { access: { address: string } };
  assert.deepEqual(parseJpAddress(home.access.address), {
    postalCode: "653-0015",
    addressRegion: "兵庫県",
    addressLocality: "神戸市長田区",
    streetAddress: "菅原通2-23 No.88ビル2F",
  });
  assert.deepEqual(parseJpAddress("Somewhere 1-2-3"), { streetAddress: "Somewhere 1-2-3" });
});

test("a JobPosting carries the required fields and escapes markup", () => {
  const job = normalizeJobs(jobFiles).jobs.ja[0];
  const labels = { duties: "仕事内容", requirements: "応募条件", preferred: "歓迎条件", hours: "勤務時間", holidays: "休日・休暇", salary: "給与", benefits: "待遇・福利厚生", trialPeriod: "試用期間", other: "その他", pr: "求人PR" };
  const posting = jobPostingJsonLd({ job, labels, organization: { name: "株式会社UO", url: "https://www.uoworld.net/", logo: "https://www.uoworld.net/uo-logo-pure.png" }, address: "〒653-0015 兵庫県神戸市長田区菅原通2-23" });
  assert.ok(posting);
  assert.equal(posting.title, job.title);
  assert.equal(posting.datePosted, "2026-09-15");
  assert.deepEqual(posting.employmentType, ["PART_TIME"]);
  assert.match(String(posting.description), /<h3>仕事内容<\/h3>.*<li>商品のピッキング<\/li>/);
  assert.equal(jobPostingJsonLd({ job: { ...job, datePosted: "" }, labels, organization: { name: "", url: "", logo: "" }, address: "" }), null);
  assert.equal(jsonLdScript({ text: "</script>" }), '{"text":"\\u003c/script>"}');
});
