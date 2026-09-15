import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { SLUG_PATTERN } from "../../.vitepress/theme/content/recruitData.ts";

/*
 * 招聘数据和后台配置（public/admin/config.yml）要对得上：后台保存时可能丢掉配置里没声明的字段，
 * 必填栏在三种语言里都要有内容（后台也会这样要求）。
 * 文件格式是 Sveltia 的 i18n single_file：顶层是 ja / zh / en；共用栏目（i18n: false）只在 ja 下面。
 */

interface Field {
  name: string;
  widget?: string;
  required?: boolean;
  i18n?: boolean | string;
  multiple?: boolean;
  options?: { value: string }[];
  field?: Field;
  fields?: Field[];
}

const repo = new URL("../../", import.meta.url);
const config = parse(readFileSync(new URL("public/admin/config.yml", repo), "utf8")) as {
  i18n?: { structure?: string; locales?: string[]; default_locale?: string };
  collections: { name: string; folder?: string; format?: string; create?: boolean; i18n?: boolean; slug?: string; fields?: Field[]; files?: { file: string; fields: Field[] }[] }[];
};
const LOCALES = ["ja", "zh", "en"];
const jobsCollection = config.collections.find((collection) => collection.name === "recruit-jobs");
const pageEntry = config.collections.find((collection) => collection.name === "recruit-page")?.files?.find((file) => file.file === "data/recruit/page.json");
const readJson = (path: string): Record<string, unknown> => JSON.parse(readFileSync(new URL(path, repo), "utf8"));

const translatable = (field: Field) => field.i18n === true || field.i18n === "translate";
const isEmpty = (value: unknown) => value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

function check(value: unknown, field: Field, path: string, locale: string, errors: string[]): void {
  const widget = field.widget ?? "string";
  if (isEmpty(value)) {
    if (field.required !== false) errors.push(`${path}: required but empty`);
    return;
  }
  if (widget === "object") return checkObject(value, field.fields ?? [], path, locale, errors);
  if (widget === "list") {
    if (!Array.isArray(value)) return void errors.push(`${path}: expected a list`);
    value.forEach((item, index) =>
      field.fields ? checkObject(item, field.fields, `${path}[${index}]`, locale, errors) : check(item, field.field!, `${path}[${index}]`, locale, errors),
    );
    return;
  }
  if (widget === "boolean" && typeof value !== "boolean") return void errors.push(`${path}: expected true/false`);
  if (widget === "number" && typeof value !== "number") return void errors.push(`${path}: expected a number`);
  if (widget === "select") {
    const allowed = new Set((field.options ?? []).map((option) => option.value));
    const values = field.multiple ? value : [value];
    if (!Array.isArray(values) || values.some((item) => !allowed.has(item as string))) errors.push(`${path}: ${JSON.stringify(value)} is not one of the options`);
    return;
  }
  if (!["boolean", "number"].includes(widget) && typeof value !== "string") errors.push(`${path}: expected a string`);
}

// ja 要有全部栏目；zh / en 只能有需要翻译的栏目
function checkObject(value: unknown, fields: Field[], path: string, locale: string, errors: string[]): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) return void errors.push(`${path}: expected an object`);
  const expected = locale === "ja" ? fields : fields.filter(translatable);
  const declared = new Set(expected.map((field) => field.name));
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!declared.has(key)) errors.push(`${path}.${key}: not declared for ${locale} in the CMS config`);
  }
  for (const field of expected) check(record[field.name], field, `${path}.${field.name}`, locale, errors);
}

const checkI18nFile = (data: Record<string, unknown>, fields: Field[], path: string): string[] => {
  const errors: string[] = [];
  assert.deepEqual(Object.keys(data).sort(), [...LOCALES].sort(), `${path}: top-level keys`);
  for (const locale of LOCALES) checkObject(data[locale], fields, `${path}.${locale}`, locale, errors);
  return errors;
};

test("the CMS stores all three languages in one file per entry", () => {
  assert.equal(config.i18n?.structure, "single_file");
  assert.deepEqual(config.i18n?.locales, LOCALES);
  assert.equal(config.i18n?.default_locale, "ja");
  assert.ok(jobsCollection, "recruit-jobs is missing");
  assert.equal(jobsCollection.folder, "data/recruit/jobs");
  assert.equal(jobsCollection.format, "json");
  assert.equal(jobsCollection.create, true);
  assert.equal(jobsCollection.i18n, true);
  assert.equal(jobsCollection.slug, "{{fields.slug}}");
  assert.ok(pageEntry, "recruit-page -> data/recruit/page.json is missing");
});

test("every position file matches the CMS fields in all three languages", () => {
  const slugs: string[] = [];
  for (const name of readdirSync(new URL("data/recruit/jobs/", repo)).filter((file) => file.endsWith(".json"))) {
    const data = readJson(`data/recruit/jobs/${name}`);
    assert.deepEqual(checkI18nFile(data, jobsCollection?.fields ?? [], name), [], name);
    const slug = String((data.ja as Record<string, unknown>).slug);
    assert.match(slug, SLUG_PATTERN, name);
    slugs.push(slug);
  }
  assert.equal(slugs.length, 9);
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique");
});

test("the recruit page matches the CMS fields in all three languages", () => {
  assert.deepEqual(checkI18nFile(readJson("data/recruit/page.json"), pageEntry?.fields ?? [], "page.json"), []);
});

test("the validator catches undeclared keys, missing translations and bad options", () => {
  const fields: Field[] = [
    { name: "slug", i18n: false },
    { name: "category", widget: "select", i18n: false, options: [{ value: "design" }] },
    { name: "title", i18n: true },
  ];
  const errors = checkI18nFile({ ja: { slug: "a", category: "sales", title: "x" }, zh: { title: "" }, en: { title: "y", slug: "a" } }, fields, "sample");
  assert.deepEqual(errors, [
    'sample.ja.category: "sales" is not one of the options',
    "sample.zh.title: required but empty",
    "sample.en.slug: not declared for en in the CMS config",
  ]);
});
