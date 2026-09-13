<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";

const props = defineProps<{ href: string; label: string }>();
const resolvedHref = computed(() => (props.href.startsWith("/") ? withBase(props.href) : props.href));
</script>

<template>
  <a class="arrow-link" :href="resolvedHref">
    {{ label }}
    <svg class="arrow-link__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  </a>
</template>

<style scoped>
.arrow-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #6fa9de;
  transition: gap 0.2s ease;
}

.arrow-link:hover {
  gap: 0.85rem;
  color: #9ec8ec;
}

.arrow-link__icon {
  width: 0.8rem;
  height: 0.8rem;
}
</style>
