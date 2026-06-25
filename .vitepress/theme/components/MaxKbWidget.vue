<script setup lang="ts">
import { onMounted } from "vue";
import { inBrowser } from "vitepress";

const MAXKB_EMBED_SCRIPT_ID = "maxkb-widget-script";
const MAXKB_EMBED_SRC =
  "https://robot.toiroworld.com/chat/api/embed?protocol=https&host=robot.toiroworld.com&token=819b3a0fbedcba07";

onMounted(() => {
  if (!inBrowser || document.getElementById(MAXKB_EMBED_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = MAXKB_EMBED_SCRIPT_ID;
  script.src = MAXKB_EMBED_SRC;
  script.async = true;
  script.defer = true;

  document.body.appendChild(script);
});
</script>

<template></template>
