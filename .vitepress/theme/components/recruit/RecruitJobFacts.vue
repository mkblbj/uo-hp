<script setup lang="ts">
import { firstLine, type Job } from "../../content/recruitData";
import { employmentFull, type RecruitUi } from "../../content/recruitUi";
import { navLinkAttrs } from "../../utils/linkAttrs";

defineProps<{ job: Job; ui: RecruitUi; location: string; accessHref: string }>();
</script>

<template>
  <div class="facts-band">
    <dl class="facts corp-container">
      <div class="fact">
        <dt>{{ ui.conditions.employment }}</dt>
        <dd>{{ employmentFull(job.employmentTypes, ui) }}</dd>
      </div>
      <div class="fact">
        <dt>{{ ui.conditions.salary }}</dt>
        <dd>{{ firstLine(job.salary) }}</dd>
      </div>
      <div class="fact">
        <dt>{{ ui.conditions.hours }}</dt>
        <dd>{{ job.hours.text }}</dd>
      </div>
      <div class="fact">
        <dt>{{ ui.conditions.workplace }}</dt>
        <dd>
          {{ location }}
          <a class="fact__link" v-bind="navLinkAttrs(accessHref)">{{ ui.cta.access }} →</a>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
/* 位置和内页的栏目页签一样：紧贴在标题区下面的一条 */
.facts-band {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(199, 215, 231, 0.1);
  border-bottom: 1px solid rgba(199, 215, 231, 0.1);
  background: rgba(5, 8, 9, 0.92);
}

.facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 0;
  margin-bottom: 0;
}

.fact {
  margin: 0;
  padding: 1.15rem 1.4rem 1.2rem;
}

.fact:first-child {
  padding-left: 0;
}

.fact + .fact {
  border-left: 1px solid rgba(199, 215, 231, 0.1);
}

.fact dt {
  margin: 0 0 0.4rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: rgba(175, 208, 238, 0.9);
}

.fact dd {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.6;
  color: #fff;
}

.fact__link {
  margin-left: 0.4rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: #6fa9de;
  white-space: nowrap;
}

.fact__link:hover {
  color: #9ec8ec;
}

@media (max-width: 760px) {
  .facts {
    grid-template-columns: 1fr 1fr;
  }

  .fact {
    padding: 0.95rem 1rem 1rem 0;
  }

  .fact:nth-child(even) {
    padding-left: 1rem;
  }

  .fact:nth-child(3) {
    border-left: none;
  }

  .fact:nth-child(n + 3) {
    border-top: 1px solid rgba(199, 215, 231, 0.1);
  }
}
</style>
