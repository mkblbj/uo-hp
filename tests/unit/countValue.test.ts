import test from "node:test";
import assert from "node:assert/strict";
import { formatCountValue, parseCountValue } from "../../.vitepress/theme/utils/countValue.ts";

test("parses grouped integers", () => {
  assert.deepEqual(parseCountValue("16,755"), { prefix: "", target: 16755, decimals: 0, grouped: true, suffix: "" });
});

test("parses decimals", () => {
  assert.deepEqual(parseCountValue("4.59"), { prefix: "", target: 4.59, decimals: 2, grouped: false, suffix: "" });
});

test("keeps unit suffixes and prefixes", () => {
  assert.deepEqual(parseCountValue("100万"), { prefix: "", target: 100, decimals: 0, grouped: false, suffix: "万" });
  assert.equal(parseCountValue("31位")?.suffix, "位");
  assert.equal(parseCountValue("20名")?.target, 20);
  assert.deepEqual(parseCountValue("¥1,200円"), { prefix: "¥", target: 1200, decimals: 0, grouped: true, suffix: "円" });
});

test("rejects text that cannot be animated", () => {
  for (const text of ["", "abc", "2015→2018", "1,2345"]) {
    assert.equal(parseCountValue(text), null, text);
  }
});

test("formats intermediate and final frames", () => {
  const reviews = parseCountValue("16,755")!;
  assert.equal(formatCountValue(reviews, 0), "0");
  assert.equal(formatCountValue(reviews, 1234.4), "1,234");
  assert.equal(formatCountValue(reviews, reviews.target), "16,755");
  const rating = parseCountValue("4.59")!;
  assert.equal(formatCountValue(rating, 0), "0.00");
  assert.equal(formatCountValue(rating, rating.target), "4.59");
  assert.equal(formatCountValue(parseCountValue("100万")!, 50.6), "51万");
});

test("round-trips every trust value used on the homepage", () => {
  for (const text of ["100万", "20名", "4.59", "16,755", "31位", "7"]) {
    const value = parseCountValue(text);
    assert.ok(value, text);
    assert.equal(formatCountValue(value, value.target), text);
  }
});
