import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import HeroLayout from "./layouts/HeroLayout.vue";
import "./styles/hero.css";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("hero", HeroLayout);
  },
};

export default theme;
