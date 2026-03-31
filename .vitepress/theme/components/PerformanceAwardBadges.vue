<script setup lang="ts">
import AwardBadge from "./AwardBadge.vue";

const laurelIconPath =
  "M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987m-4.5 1.987c.787 3-.188 5.888-.188 5.888S7.988 14.962 7.2 11.962c-.787-3 .188-5.887.188-5.887s2.287 1.987 3.075 4.987m.862 10.388s-.6-2.962-2.775-5.175C6.337 14.1 3.375 13.5 3.375 13.5s.6 2.962 2.775 5.175c2.213 2.175 5.175 2.775 5.175 2.775m3.3 3.413s-1.988-2.288-4.988-3.075-5.887.187-5.887.187 1.987 2.287 4.988 3.075c3 .787 5.887-.188 5.887-.188Zm6.75 0s1.988-2.288 4.988-3.075c3-.826 5.887.187 5.887.187s-1.988 2.287-4.988 3.075c-3 .787-5.887-.188-5.887-.188ZM32.625 13.5s-2.963.6-5.175 2.775c-2.213 2.213-2.775 5.175-2.775 5.175s2.962-.6 5.175-2.775c2.175-2.213 2.775-5.175 2.775-5.175M28.65 6.075s.975 2.887.188 5.887c-.826 3-3.076 4.988-3.076 4.988s-.974-2.888-.187-5.888c.788-3 3.075-4.987 3.075-4.987m-4.5 7.987s.975-2.887.188-5.887c-.788-3-3.076-4.988-3.076-4.988s-.974 2.888-.187 5.888c.788 3 3.075 4.988 3.075 4.988ZM18 26.1c.975-.225 3.113-.6 5.325 0 3 .788 5.063 3.038 5.063 3.038s-2.888.975-5.888.187a13 13 0 0 1-1.425-.525c.563.788 1.125 1.425 2.288 1.913l-.863 2.062c-2.063-.862-2.925-2.137-3.675-3.262-.262-.375-.525-.713-.787-1.05-.26.293-.465.586-.686.903l-.102.147-.048.068c-.775 1.108-1.643 2.35-3.627 3.194l-.862-2.062c1.162-.488 1.725-1.125 2.287-1.913-.45.225-.938.375-1.425.525-3 .788-5.887-.187-5.887-.187s1.987-2.288 4.987-3.075c2.212-.563 4.35-.188 5.325.037";
</script>

<template>
  <section class="performance-badges" aria-label="販売実績ハイライト">
    <div class="performance-badges__top">
      <AwardBadge
        title="2021年売上 1億円"
        subtitle="ショップ開設2年後から"
        bg-color="#f3e3ac"
        :icon-path="laurelIconPath"
      />
    </div>
    <div class="performance-badges__bottom">
      <AwardBadge
        title="4.59（16,755件）"
        subtitle="口コミ総合評価"
        bg-color="#f3e3ac"
        :icon-path="laurelIconPath"
      />
      <AwardBadge
        title="売上ランク 31位獲得"
        subtitle="楽天市場全ショップ内で"
        bg-color="#f3e3ac"
        :icon-path="laurelIconPath"
      />
    </div>
    <ul class="performance-badges__notes">
      <li>
        口コミ総合評価と口コミ件数は、松武商店（楽天市場）の公開情報をもとにした2026年3月31日時点の数値です。
      </li>
      <li>
        出店開始、2021年売上、楽天市場内ランキングは、これまでの実績を示しています。
      </li>
    </ul>
  </section>
</template>

<style scoped>
.performance-badges {
  margin: 1.5rem 0 2rem;
}

.performance-badges__top {
  display: flex;
  justify-content: center;
  max-width: 320px;
  margin: 0 auto 0.75rem;
}

.performance-badges__bottom {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  max-width: 660px;
  margin: 0 auto;
}

.performance-badges__bottom > * {
  flex: 1;
  min-width: 0;
  max-width: 320px;
}

.performance-badges__notes {
  display: grid;
  gap: 0.4rem;
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
}

.performance-badges__notes li {
  color: #78716c;
  font-size: 0.88rem;
  line-height: 1.65;
}

.performance-badges__notes li::before {
  content: "※ ";
  color: #8e6f40;
  font-weight: 700;
}

@media (max-width: 540px) {
  .performance-badges__bottom {
    flex-direction: column;
    align-items: center;
  }

  .performance-badges__bottom > * {
    max-width: 320px;
    width: 100%;
  }

  .performance-badges__top {
    max-width: 100%;
  }
}
</style>
