import test from "node:test";
import assert from "node:assert/strict";
import { directionsUrl, parseLatLng } from "../../.vitepress/theme/utils/accessMap.ts";

const OFFICE = { lat: 34.665003, lng: 135.1580635 };

test("coordinates pasted from Google Maps are parsed", () => {
  assert.deepEqual(parseLatLng("34.665003, 135.1580635"), OFFICE);
  assert.deepEqual(parseLatLng("  34.665003 ,135.1580635 "), OFFICE);
  // 日文输入法下常打出全角逗号
  assert.deepEqual(parseLatLng("34.665003，135.1580635"), OFFICE);
});

test("malformed, swapped or out-of-range coordinates are rejected", () => {
  const rejected = [
    undefined,
    "",
    ", ",
    "34.665003,",
    "34.665003",
    "abc, def",
    "34.665003, 135.1580635, 1",
    "135.1580635, 34.665003",
    "34.665003, 181",
  ];
  for (const text of rejected) assert.equal(parseLatLng(text), null, String(text));
});

test("the route link navigates to the exact coordinates", () => {
  assert.equal(
    directionsUrl(OFFICE, "兵庫県神戸市長田区菅原通2-23"),
    "https://www.google.com/maps/dir/?api=1&destination=34.665003%2C135.1580635",
  );
});

test("the route link falls back to the address without coordinates", () => {
  const url = new URL(directionsUrl(null, "兵庫県神戸市長田区菅原通2-23 No.88ビル2F"));
  assert.equal(`${url.origin}${url.pathname}`, "https://www.google.com/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("destination"), "兵庫県神戸市長田区菅原通2-23 No.88ビル2F");
});
