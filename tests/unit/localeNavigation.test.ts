import test from "node:test";
import assert from "node:assert/strict";
import { navigateToLocale } from "../../.vitepress/theme/utils/localeNavigation.ts";

test("locale navigation performs a hard navigation so shared homepage state is remounted", () => {
  let target = "";
  const event = { preventDefault: () => undefined } as { preventDefault: () => void };
  navigateToLocale(event, "/en/", (href) => { target = href; });
  assert.equal(target, "/en/");
});
