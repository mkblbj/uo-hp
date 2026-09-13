import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";

const dist = new URL("../../.vitepress/dist/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, dist), "utf8");
const OLD_FONTS = "family=Cormorant+Garamond";

const filesUnder = (dir: URL, extension: string): URL[] =>
  readdirSync(dir).flatMap((name) => {
    const url = new URL(name, dir);
    if (statSync(url).isDirectory()) return filesUnder(new URL(`${name}/`, dir), extension);
    return name.endsWith(extension) ? [url] : [];
  });

test("the site has been built", () => {
  assert.ok(existsSync(new URL("index.html", dist)), "run `pnpm build` first");
});

test("no page or bundle loads the MaxKB chat widget", () => {
  for (const file of [...filesUnder(dist, ".html"), ...filesUnder(new URL("assets/", dist), ".js")]) {
    assert.ok(!readFileSync(file, "utf8").includes("toiroworld"), file.pathname);
  }
});

test("the legacy zh/en homepages still load their fonts", () => {
  assert.ok(read("zh/index.html").includes(OLD_FONTS));
  assert.ok(read("en/index.html").includes(OLD_FONTS));
});

test("inner pages and the shared CSS bundle no longer load Google Fonts", () => {
  for (const page of ["about/index.html", "about/profile/index.html", "services/index.html"]) {
    assert.ok(!read(page).includes("fonts.googleapis.com"), page);
  }
  for (const css of filesUnder(new URL("assets/", dist), ".css")) {
    assert.ok(!readFileSync(css, "utf8").includes("fonts.googleapis.com"), css.pathname);
  }
});
