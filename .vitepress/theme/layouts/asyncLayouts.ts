// 按需下载的布局（招聘页）：Layout.vue 用它们注册异步组件，换页动画（utils/pageTransitionClient.ts）用它们等布局下载完
export const loadRecruitLayout = () => import("./RecruitLayout.vue");
export const loadRecruitJobLayout = () => import("./RecruitJobLayout.vue");

/** 键是页面 frontmatter 里的 layout */
export const asyncLayoutLoaders: Record<string, () => Promise<unknown>> = {
  recruit: loadRecruitLayout,
  "recruit-job": loadRecruitJobLayout,
};
