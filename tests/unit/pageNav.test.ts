import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  JA_SECTIONS,
  getPageNav,
  homeNavItems,
  innerNavItems,
  normalizePath,
  pageCrumbs,
} from "../../.vitepress/theme/content/pageNav.ts";

const repo = new URL("../../", import.meta.url);
const labels = { company: "会社情報", business: "事業案内", performance: "販売実績", tech: "技術・AI" };
const ORDER = [
  "/about/",
  "/about/profile/",
  "/about/message/",
  "/services/",
  "/services/mobile-accessories/",
  "/services/domestic-foods/",
  "/services/oem-wholesale/",
  "/services/products/",
  "/services/performance/",
  "/services/strengths/",
  "/services/future/",
];

test("the site map lists the 11 Japanese inner pages in order, and each one exists", () => {
  const paths = JA_SECTIONS.flatMap((section) => section.groups.flat().map((page) => page.path));
  assert.deepEqual(paths, ORDER);
  for (const path of paths) assert.ok(existsSync(new URL(`${path.slice(1)}index.md`, repo)), path);
});

test("paths are normalised before lookup", () => {
  assert.equal(normalizePath("/about/profile"), "/about/profile/");
  assert.equal(normalizePath("/about/profile.html#history"), "/about/profile/");
  assert.equal(normalizePath("/services/index.html?x=1"), "/services/");
  assert.equal(normalizePath(""), "/");
  assert.equal(getPageNav("/about/profile")?.tabs.find((tab) => tab.current)?.path, "/about/profile/");
});

test("pages outside the site map have no page navigation", () => {
  assert.equal(getPageNav("/"), null);
  assert.equal(getPageNav("/zh/about/"), null);
  assert.equal(getPageNav("/unknown/"), null);
});

test("company pages: tabs, header highlight and section top", () => {
  const nav = getPageNav("/about/message/");
  assert.ok(nav);
  assert.equal(nav.section.label, "会社情報");
  assert.equal(nav.headerKey, "company");
  assert.equal(nav.isSectionTop, false);
  assert.deepEqual(
    nav.tabs.map((tab) => [tab.no, tab.label, tab.current, tab.groupStart]),
    [
      ["01", "会社情報トップ", false, false],
      ["02", "会社概要", false, false],
      ["03", "代表挨拶", true, false],
    ],
  );
  assert.equal(getPageNav("/about/")?.isSectionTop, true);
});

test("business tabs are split into two groups and the performance page highlights its own header link", () => {
  const nav = getPageNav("/services/performance/");
  assert.ok(nav);
  assert.equal(nav.headerKey, "performance");
  assert.equal(nav.tabs.length, 8);
  assert.deepEqual(nav.tabs.filter((tab) => tab.groupStart).map((tab) => tab.label), ["主要商品"]);
  assert.equal(nav.tabs.find((tab) => tab.current)?.no, "06");
  assert.equal(getPageNav("/services/future/")?.headerKey, "business");
});

test("prev / next follow the site order across sections", () => {
  assert.equal(getPageNav("/about/")?.prev, null);
  assert.deepEqual(getPageNav("/about/message/")?.next, { path: "/services/", label: "事業概要", no: "01" });
  assert.deepEqual(getPageNav("/services/")?.prev, { path: "/about/message/", label: "代表挨拶", no: "03" });
  assert.equal(getPageNav("/services/future/")?.next, null);
  for (let i = 1; i < ORDER.length; i++) assert.equal(getPageNav(ORDER[i])?.prev?.path, ORDER[i - 1]);
});

test("section tops list the other pages of their section as cards", () => {
  assert.deepEqual(
    getPageNav("/about/")?.sectionPages.map((page) => [page.no, page.label]),
    [
      ["02", "会社概要"],
      ["03", "代表挨拶"],
    ],
  );
  assert.deepEqual(getPageNav("/services/")?.sectionPages.map((page) => page.no), ["02", "03", "04", "05", "06", "07", "08"]);
});

test("breadcrumbs: home / section / page, and two levels on a section top", () => {
  assert.deepEqual(pageCrumbs(getPageNav("/about/profile/")!, "ホーム", "会社概要"), [
    { label: "ホーム", path: "/" },
    { label: "会社情報", path: "/about/" },
    { label: "会社概要" },
  ]);
  assert.deepEqual(pageCrumbs(getPageNav("/services/")!, "ホーム", "事業案内"), [
    { label: "ホーム", path: "/" },
    { label: "事業案内" },
  ]);
});

test("the homepage header keeps its in-page anchors", () => {
  const items = homeNavItems(labels);
  assert.deepEqual(items.map((item) => item.href), ["#company", "#business", "#performance", "#tech"]);
  assert.deepEqual(items.map((item) => item.label), ["会社情報", "事業案内", "販売実績", "技術・AI"]);
  assert.ok(items.every((item) => !item.active && !item.current));
});

test("inner page headers link to pages, highlight the section and mark the current page", () => {
  const onServices = innerNavItems(labels, "/services/");
  assert.deepEqual(onServices.map((item) => item.href), ["/about/", "/services/", "/services/performance/", "/#tech"]);
  assert.deepEqual(onServices.map((item) => item.active), [false, true, false, false]);
  assert.deepEqual(onServices.map((item) => item.current), [false, true, false, false]);
  assert.deepEqual(innerNavItems(labels, "/services/performance/").map((item) => item.active), [false, false, true, false]);
  assert.deepEqual(
    innerNavItems(labels, "/about/profile/").map((item) => [item.active, item.current]),
    [
      [true, false],
      [false, false],
      [false, false],
      [false, false],
    ],
  );
});
