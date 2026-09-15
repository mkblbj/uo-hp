import { defineLoader } from "vitepress";
import { loadRecruit } from "../../recruit/source";
import type { RecruitData } from "../content/recruitData";

/** 招聘数据（职位 + 招聘首页，三语各一份）：构建时从 data/recruit/ 读取整理，只有招聘页的布局会用到 */
declare const data: RecruitData;
export { data };

export default defineLoader({
  // 本地预览时改了这些文件会自动刷新；新增职位的页面要重启预览才会生成（动态路由在启动时算好）
  watch: ["../../../data/recruit/**/*.json"],
  // 缺译文、网址名重复等提示只在这里打印一次
  load: () => loadRecruit(true),
});
