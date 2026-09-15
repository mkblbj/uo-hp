export interface LocaleLinkEvent {
  preventDefault: () => void;
}

/**
 * 切换语言走整页加载，各语言首页的状态才会重新初始化。
 * 语言链接还要带 target="_self"：VitePress 的站内跳转先于这里处理点击，不带的话它会先在当前页面里切过去、多记一条历史，
 * 按「后退」时就在同一个页面里换回原来的语言
 */
export const navigateToLocale = (
  event: LocaleLinkEvent,
  href: string,
  navigate: (target: string) => void = (target) => window.location.assign(target),
) => {
  event.preventDefault();
  navigate(href);
};
