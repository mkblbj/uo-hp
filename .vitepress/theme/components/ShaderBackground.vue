<script setup lang="ts">
import { useShaderBackground } from "../composables/useShaderBackground";

const { canvasRef, isSupported } = useShaderBackground();
</script>

<template>
  <div class="shader-background" aria-hidden="true">
    <div class="shader-fallback">
      <div class="shader-fallback__grid" />
      <div class="shader-fallback__orb shader-fallback__orb--primary" />
      <div class="shader-fallback__orb shader-fallback__orb--secondary" />
      <div class="shader-fallback__orb shader-fallback__orb--tertiary" />
    </div>
    <canvas ref="canvasRef" class="shader-canvas" :class="{ 'is-active': isSupported }" />
  </div>
</template>
