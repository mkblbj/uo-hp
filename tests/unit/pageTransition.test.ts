import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pageKey, shouldAnimatePageChange } from "../../.vitepress/theme/utils/pageTransition.ts";

const change = { supported: true, reducedMotion: false, hidden: false, browserAnimating: false, from: "/about/", to: "/services/" };

test("page changes animate when the browser supports view transitions", () => {
  assert.equal(shouldAnimatePageChange(change), true);
});

test("page changes skip the animation when it is unsupported or unwanted", () => {
  assert.equal(shouldAnimatePageChange({ ...change, supported: false }), false);
  assert.equal(shouldAnimatePageChange({ ...change, reducedMotion: true }), false);
  assert.equal(shouldAnimatePageChange({ ...change, hidden: true }), false);
  // iPhone swipe-back already plays the browser's own animation
  assert.equal(shouldAnimatePageChange({ ...change, browserAnimating: true }), false);
  // back/forward between anchors of the same page is not a page change
  assert.equal(shouldAnimatePageChange({ ...change, to: "/about/#history" }), false);
});

test("pageKey compares pages, ignoring anchors, queries and index.html", () => {
  assert.equal(pageKey("/about/index.html"), pageKey("/about/"));
  assert.equal(pageKey("/about/profile?x=1#top"), pageKey("/about/profile/"));
  assert.equal(pageKey("/index.html"), "/");
  assert.notEqual(pageKey("/zh/"), pageKey("/"));
  assert.notEqual(pageKey("/recruit/"), pageKey("/recruit/sales/"));
});

test("full-page loads (language switch) use the same animation unless reduced motion is on", () => {
  const css = readFileSync(new URL("../../.vitepress/theme/styles/page-transition.css", import.meta.url), "utf8");
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition \{\s*navigation: auto;/);
  const header = readFileSync(new URL("../../.vitepress/theme/components/corporate/CorpHeader.vue", import.meta.url), "utf8");
  assert.match(header, /view-transition-name: corp-header;/);
});
