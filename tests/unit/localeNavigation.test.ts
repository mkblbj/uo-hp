import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { navigateToLocale } from "../../.vitepress/theme/utils/localeNavigation.ts";

test("locale navigation performs a hard navigation so shared homepage state is remounted", () => {
  let target = "";
  const event = { preventDefault: () => undefined } as { preventDefault: () => void };
  navigateToLocale(event, "/en/", (href) => { target = href; });
  assert.equal(target, "/en/");
});

test("the footer locale links use the same hard-navigation handler", () => {
  const source = readFileSync(new URL("../../.vitepress/theme/components/corporate/CorpFooter.vue", import.meta.url), "utf8");
  assert.match(source, /navigateToLocale/);
  assert.match(source, /@click="onLocaleClick\(\$event, localeLinks\[item\.locale\]\)"/);
});

test("locale links carry target=_self so the VitePress router does not switch languages in place first", () => {
  for (const file of ["corporate/CorpLangMenu.vue", "corporate/CorpFooter.vue", "LanguageToggle.vue"]) {
    const source = readFileSync(new URL(`../../.vitepress/theme/components/${file}`, import.meta.url), "utf8");
    const localeLink = source.match(/<a\b[^>]*@click="onLocaleClick[^>]*>/)?.[0] ?? "";
    assert.match(localeLink, /target="_self"/, file);
  }
});
