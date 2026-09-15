import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeJobs, normalizePage, type RecruitData } from "../theme/content/recruitData";

/*
 * 读招聘数据的文件（只在构建时、Node 里运行）：职位页的动态路由、数据加载器、config.ts 的 transformPageData 都用它。
 * VitePress 和测试都从仓库根目录运行，所以按当前目录找文件。
 */

const ROOT = process.cwd();
const JOBS_DIR = join(ROOT, "data/recruit/jobs");
const PAGE_FILE = join(ROOT, "data/recruit/page.json");

const readJson = (file: string): unknown => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    // 文件坏了就让构建失败（线上保持上一个版本），不悄悄少一个职位
    throw new Error(`[recruit] ${file} is not valid JSON: ${(error as Error).message}`);
  }
};

const readJobFiles = () =>
  existsSync(JOBS_DIR)
    ? readdirSync(JOBS_DIR)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => ({ name, data: readJson(join(JOBS_DIR, name)) }))
    : [];

/** 读取并整理全部招聘数据。warn 为 true 时把提示（缺译文、网址名重复等）打印到构建日志；只让数据加载器打印一次 */
export const loadRecruit = (warn = false): RecruitData => {
  const jobs = normalizeJobs(readJobFiles());
  const page = normalizePage(existsSync(PAGE_FILE) ? readJson(PAGE_FILE) : {});
  if (warn) for (const warning of [...jobs.warnings, ...page.warnings]) console.warn(`[recruit] ${warning}`);
  return { jobs: jobs.jobs, page: page.page };
};

/** 职位页的动态路由：每个公开职位一页（三种语言的职位相同） */
export const recruitPaths = () => loadRecruit().jobs.ja.map((job) => ({ params: { job: job.slug } }));

/** 首页数据里的公司名和 ACCESS 地址（给结构化数据用；地址只有日文页面用得到） */
export const readHomeBasics = (locale: "ja" | "zh" | "en" = "ja") => {
  const home = readJson(join(ROOT, `data/home/${locale}.json`)) as { brand?: { name?: string }; access?: { address?: string } };
  return { name: home.brand?.name ?? "", address: home.access?.address ?? "" };
};
