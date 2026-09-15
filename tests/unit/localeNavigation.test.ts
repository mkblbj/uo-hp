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
