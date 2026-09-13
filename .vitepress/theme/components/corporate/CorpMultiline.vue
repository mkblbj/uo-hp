<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ text: string }>();
const lines = computed(() => props.text.split("\n"));
</script>

<template>
  <template v-for="(line, index) in lines" :key="index"><br v-if="index > 0" />{{ line }}</template>
</template>
