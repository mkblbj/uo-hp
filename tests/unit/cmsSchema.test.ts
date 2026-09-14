import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import ja from "../../data/home/ja.json" with { type: "json" };
import { JA_SECTIONS } from "../../.vitepress/theme/content/pageNav.ts";

interface CmsField {
  name: string;
  widget?: string;
  required?: boolean;
  field?: CmsField;
  fields?: CmsField[];
}
interface CmsFile {
  name: string;
  file: string;
  format?: string;
  fields: CmsField[];
}
interface CmsCollection {
  name: string;
  files?: CmsFile[];
}

const config = parse(readFileSync(new URL("../../public/admin/config.yml", import.meta.url), "utf8")) as {
  collections: CmsCollection[];
};
const homeEntry = config.collections
  .find((collection) => collection.name === "ja-home")
  ?.files?.find((file) => file.file === "data/home/ja.json");
const KNOWN_WIDGETS = new Set(["string", "text", "image", "list", "object"]);

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

function validate(value: unknown, field: CmsField, path: string, errors: string[]): void {
  const widget = field.widget ?? "string";
  if (!KNOWN_WIDGETS.has(widget)) {
    errors.push(`${path}: unexpected widget "${widget}"`);
    return;
  }
  if (isEmpty(value)) {
    if (field.required !== false) errors.push(`${path}: required but empty`);
    return;
  }
  if (widget === "object") {
    validateObject(value, field.fields ?? [], path, errors);
    return;
  }
  if (widget === "list") {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected a list`);
      return;
    }
    value.forEach((item, index) => {
      const itemPath = `${path}[${index}]`;
      if (field.fields) validateObject(item, field.fields, itemPath, errors);
      else if (field.field) validate(item, field.field, itemPath, errors);
      else errors.push(`${path}: list needs "field" or "fields"`);
    });
    return;
  }
  if (typeof value !== "string") errors.push(`${path}: expected a string`);
}

// 后台保存时可能丢弃配置里没声明的键，所以 JSON 的每个键都必须在配置里出现
function validateObject(value: unknown, fields: CmsField[], path: string, errors: string[]): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${path}: expected an object`);
    return;
  }
  const record = value as Record<string, unknown>;
  const declared = new Set(fields.map((field) => field.name));
  for (const key of Object.keys(record)) {
    if (!declared.has(key)) errors.push(`${path}.${key}: not declared in the CMS config (the CMS may drop it on save)`);
  }
  for (const field of fields) validate(record[field.name], field, `${path}.${field.name}`, errors);
}

test("the homepage is registered as a JSON file collection", () => {
  assert.ok(homeEntry, "ja-home -> data/home/ja.json is missing from public/admin/config.yml");
  assert.equal(homeEntry.format, "json");
});

test("every key in data/home/ja.json matches a CMS field", () => {
  const errors: string[] = [];
  validateObject(ja, homeEntry?.fields ?? [], "ja", errors);
  assert.deepEqual(errors, []);
});

test("the validator catches undeclared keys and missing required values", () => {
  const errors: string[] = [];
  validateObject({ a: "x", extra: "y" }, [{ name: "a" }, { name: "b" }], "sample", errors);
  assert.deepEqual(errors, [
    "sample.extra: not declared in the CMS config (the CMS may drop it on save)",
    "sample.b: required but empty",
  ]);
});

const innerEntries = config.collections
  .filter((collection) => collection.name === "ja-about" || collection.name === "ja-services")
  .flatMap((collection) => collection.files ?? []);

test("every Japanese inner page is registered in the CMS", () => {
  const expected = JA_SECTIONS.flatMap((section) => section.groups.flat().map((page) => `${page.path.slice(1)}index.md`));
  assert.deepEqual(innerEntries.map((entry) => entry.file).sort(), [...expected].sort());
});

test("every frontmatter key of the Japanese inner pages is declared in the CMS", () => {
  for (const entry of innerEntries) {
    const source = readFileSync(new URL(`../../${entry.file}`, import.meta.url), "utf8");
    const data = parse(/^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? "") as Record<string, unknown>;
    const declared = new Set(entry.fields.map((field) => field.name));
    for (const key of Object.keys(data)) {
      assert.ok(declared.has(key), `${entry.file}: "${key}" is not declared in the CMS config (the CMS may drop it on save)`);
    }
    for (const name of ["title", "description", "eyebrow", "pageClass", "body"]) assert.ok(declared.has(name), `${entry.file}: ${name}`);
  }
});

test("the shared-data blocks stay in their pages", () => {
  const read = (file: string) => readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  assert.match(read("about/profile/index.md"), /^::: company-profile$/m);
  assert.match(read("services/performance/index.md"), /^::: sales-results$/m);
});
