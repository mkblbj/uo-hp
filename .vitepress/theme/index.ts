import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./styles/hero.css";
import "vitepress-markdown-timeline/dist/theme/index.css";

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
};

export default theme;
