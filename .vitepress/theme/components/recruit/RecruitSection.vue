<script setup lang="ts">
defineProps<{ id?: string; no: string; title: string; sub?: string }>();
</script>

<template>
  <section :id="id" class="rsec">
    <div class="rsec__head">
      <div class="rsec__head-inner">
        <span class="rsec__no" aria-hidden="true">{{ no }}</span>
        <h2 class="rsec__title">{{ title }}</h2>
        <p v-if="sub" class="rsec__sub">{{ sub }}</p>
      </div>
    </div>
    <div class="rsec__body"><slot /></div>
  </section>
</template>

<style scoped>
/* 和内页正文的小节（corporate-prose.css 的 .corp-sec）一样：左边编号 + 小节标题（电脑端吸顶），右边内容 */
.rsec {
  display: grid;
  grid-template-columns: minmax(0, 0.32fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 5rem);
  padding: clamp(2.6rem, 5vw, 4rem) 0;
  border-bottom: 1px solid rgba(199, 215, 231, 0.08);
}

.rsec__head-inner {
  position: sticky;
  top: 96px;
}

.rsec__no {
  display: block;
  margin-bottom: 0.8rem;
  font-family: "Orbitron", sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  line-height: 1.5;
  color: #6fa9de;
}

.rsec__title {
  margin: 0;
  font-size: clamp(1.3rem, 1.9vw, 1.7rem);
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: 0.03em;
  color: #fff;
  text-wrap: balance;
}

.rsec__sub {
  margin: 0.8rem 0 0;
  font-size: 0.82rem;
  line-height: 1.8;
  color: rgba(248, 243, 235, 0.6);
}

.rsec__body {
  min-width: 0;
  max-width: 54rem;
}

.rsec__body > :deep(* + *) {
  margin-top: 1.5rem;
}

@media (max-width: 1020px) {
  .rsec {
    grid-template-columns: minmax(0, 0.38fr) minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .rsec {
    grid-template-columns: 1fr;
    gap: 1.3rem;
  }

  .rsec__head-inner {
    position: static;
  }
}
</style>
