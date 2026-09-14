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

// 页面一打开就会下载的脚本：<script src> 和 <link rel="modulepreload">
const upfrontScripts = (page: string) =>
  [...read(page).matchAll(/<(?:script[^>]*\ssrc|link[^>]*\shref)="\/(assets\/[^"]+\.js)"/g)].map((match) => new URL(match[1], dist));

test("pages without diagrams do not load the diagram library up front", () => {
  for (const page of ["index.html", "about/index.html", "about/profile/index.html", "services/index.html", "zh/index.html"]) {
    const scripts = upfrontScripts(page);
    assert.ok(scripts.length > 0, `${page} loads no scripts`);
    for (const file of scripts) {
      assert.doesNotMatch(file.pathname, /mermaid|katex|dagre|cytoscape|Diagram-|-definition-/i, `${page} preloads ${file.pathname}`);
      // Mermaid 核心里的报错文字，用来认出打包进来的图表库
      assert.ok(!readFileSync(file, "utf8").includes("No diagram type detected"), `${page} loads the Mermaid core via ${file.pathname}`);
    }
  }
});

test("pages with diagrams still render the diagram container", () => {
  for (const page of ["zh/about/profile/index.html", "en/about/profile/index.html"]) {
    assert.match(read(page), /<div[^>]*class="mermaid"/, page);
  }
});

test("the homepage does not load the map module up front", () => {
  const upfront = upfrontScripts("index.html");
  assert.ok(upfront.length > 0, "index.html loads no scripts");
  for (const file of upfront) {
    const code = readFileSync(file, "utf8");
    // 地图程序和它的内联样式里都有这个类名，路线数据里有路线服务的网址；首页自己的代码里都没有
    assert.ok(!code.includes("maplibregl-canvas"), `${file.pathname} carries the map library`);
    assert.ok(!code.includes("routing.openstreetmap.de"), `${file.pathname} carries the route data`);
  }
});

test("map styles load with the map module instead of the shared CSS bundle", () => {
  const hasMapStyles = (file: URL) => /\.maplibregl-map\s*\{/.test(readFileSync(file, "utf8"));
  const linked = [...read("index.html").matchAll(/href="\/(assets\/[^"]+\.css)"/g)].map((match) => new URL(match[1], dist));
  assert.ok(linked.length > 0, "index.html links no stylesheet");
  for (const css of linked) assert.ok(!hasMapStyles(css), `${css.pathname} carries the map styles`);
  const mapModule = filesUnder(new URL("assets/", dist), ".js").find((file) =>
    readFileSync(file, "utf8").includes("tiles.openfreemap.org"),
  );
  assert.ok(mapModule, "the map module was not emitted");
  assert.ok(hasMapStyles(mapModule), "the map module does not carry the map styles");
});

const CORP_FONTS = ["family=Noto+Sans+JP:wght@300;400;500;700;900", "family=Orbitron:wght@400;500;600;700"];

// 只看真正的 <head>：VitePress 会把各语言的 head 设置写进每个页面 body 里的 __VP_SITE_DATA__，那里出现网址并不会加载字体
const headOf = (page: string) => {
  const html = read(page);
  return html.slice(0, html.indexOf("</head>"));
};

test("Japanese pages load the corporate fonts; Chinese and English inner pages and the shared CSS do not load Google Fonts", () => {
  for (const page of ["index.html", "about/index.html", "about/profile/index.html", "services/index.html"]) {
    for (const font of CORP_FONTS) assert.ok(headOf(page).includes(font), `${page} misses ${font}`);
  }
  for (const page of ["zh/about/index.html", "en/services/index.html"]) {
    assert.ok(!headOf(page).includes("fonts.googleapis.com"), page);
  }
  for (const css of filesUnder(new URL("assets/", dist), ".css")) {
    assert.ok(!readFileSync(css, "utf8").includes("fonts.googleapis.com"), css.pathname);
  }
});

test("the inner page prose stylesheet ships with the site", () => {
  const css = filesUnder(new URL("assets/", dist), ".css").map((file) => readFileSync(file, "utf8")).join("\n");
  assert.match(css, /\.corp-prose \.corp-sec\{/);
  assert.match(css, /\.corp-prose \.timeline-dot:{1,2}before\{/);
});
