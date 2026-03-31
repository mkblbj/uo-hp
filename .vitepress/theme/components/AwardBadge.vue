<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount, computed } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    bgColor?: string;
    link?: string;
    iconPath?: string;
  }>(),
  {
    subtitle: "",
    bgColor: "#f3e3ac",
    link: "",
    iconPath: "",
  },
);

const uid = Math.random().toString(36).slice(2, 8);
const blurId = `blur-${uid}`;
const maskId = `mask-${uid}`;

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.25;
const minRotate = -0.25;
const maxScale = 1;
const minScale = 0.97;

const badgeRef = ref<HTMLElement | null>(null);
const state = reactive({
  firstOverlayPosition: 0,
  matrix: identityMatrix,
  currentMatrix: identityMatrix,
  disableInOutOverlayAnimation: true,
  disableOverlayAnimation: false,
  isTimeoutFinished: false,
});

let enterTimeout: ReturnType<typeof setTimeout> | null = null;
let leaveTimeout1: ReturnType<typeof setTimeout> | null = null;
let leaveTimeout2: ReturnType<typeof setTimeout> | null = null;
let leaveTimeout3: ReturnType<typeof setTimeout> | null = null;

onBeforeUnmount(() => {
  [enterTimeout, leaveTimeout1, leaveTimeout2, leaveTimeout3].forEach(
    (t) => t && clearTimeout(t),
  );
});

function getDimensions() {
  const rect = badgeRef.value?.getBoundingClientRect();
  return {
    left: rect?.left ?? 0,
    right: rect?.right ?? 0,
    top: rect?.top ?? 0,
    bottom: rect?.bottom ?? 0,
  };
}

function getMatrix(clientX: number, clientY: number) {
  const { left, right, top, bottom } = getDimensions();
  const xCenter = (left + right) / 2;
  const yCenter = (top + bottom) / 2;

  const scale = [
    maxScale -
      ((maxScale - minScale) * Math.abs(xCenter - clientX)) /
        (xCenter - left || 1),
    maxScale -
      ((maxScale - minScale) * Math.abs(yCenter - clientY)) /
        (yCenter - top || 1),
    maxScale -
      ((maxScale - minScale) *
        (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
        (xCenter - left + yCenter - top || 1),
  ];

  const rotate = {
    x1:
      0.25 *
      ((yCenter - clientY) / (yCenter || 1) -
        (xCenter - clientX) / (xCenter || 1)),
    x2:
      maxRotate -
      ((maxRotate - minRotate) * Math.abs(right - clientX)) /
        (right - left || 1),
    x3: 0,
    y0: 0,
    y2:
      maxRotate -
      ((maxRotate - minRotate) * (top - clientY)) / (top - bottom || 1),
    y3: 0,
    z0: -(
      maxRotate -
      ((maxRotate - minRotate) * Math.abs(right - clientX)) /
        (right - left || 1)
    ),
    z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / (top - bottom || 1),
    z3: 0,
  };

  return (
    `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
    `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
    `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
    `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
  );
}

function getOppositeMatrix(
  _matrix: string,
  clientY: number,
  isEnter?: boolean,
) {
  const { top, bottom } = getDimensions();
  const oppositeY = bottom - clientY + top;
  const weakening = isEnter ? 0.7 : 4;
  const multiplier = isEnter ? -1 : 1;

  return _matrix
    .split(", ")
    .map((item, index) => {
      if (index === 2 || index === 4 || index === 8) {
        return (-parseFloat(item) * multiplier) / weakening;
      } else if (index === 0 || index === 5 || index === 10) {
        return "1";
      } else if (index === 6) {
        return (
          (multiplier *
            (maxRotate -
              ((maxRotate - minRotate) * (top - oppositeY)) /
                (top - bottom || 1))) /
          weakening
        );
      } else if (index === 9) {
        return (
          (maxRotate -
            ((maxRotate - minRotate) * (top - oppositeY)) /
              (top - bottom || 1)) /
          weakening
        );
      }
      return item;
    })
    .join(", ");
}

function handleMouseEnter(e: MouseEvent) {
  [leaveTimeout1, leaveTimeout2, leaveTimeout3].forEach(
    (t) => t && clearTimeout(t),
  );
  state.disableOverlayAnimation = true;

  const { left, right, top, bottom } = getDimensions();
  const xCenter = (left + right) / 2;
  const yCenter = (top + bottom) / 2;

  state.disableInOutOverlayAnimation = false;
  enterTimeout = setTimeout(
    () => (state.disableInOutOverlayAnimation = true),
    350,
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      state.firstOverlayPosition =
        (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5;
    });
  });

  const mat = getMatrix(e.clientX, e.clientY);
  state.matrix = getOppositeMatrix(mat, e.clientY, true);
  state.isTimeoutFinished = false;
  setTimeout(() => (state.isTimeoutFinished = true), 200);
}

function handleMouseMove(e: MouseEvent) {
  const { left, right, top, bottom } = getDimensions();
  const xCenter = (left + right) / 2;
  const yCenter = (top + bottom) / 2;

  setTimeout(() => {
    state.firstOverlayPosition =
      (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5;
  }, 150);

  if (state.isTimeoutFinished) {
    state.currentMatrix = getMatrix(e.clientX, e.clientY);
  }
}

function handleMouseLeave(e: MouseEvent) {
  const oppositeMatrix = getOppositeMatrix(state.matrix, e.clientY);
  if (enterTimeout) clearTimeout(enterTimeout);

  state.currentMatrix = oppositeMatrix;
  setTimeout(() => (state.currentMatrix = identityMatrix), 200);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      state.disableInOutOverlayAnimation = false;
      leaveTimeout1 = setTimeout(
        () =>
          (state.firstOverlayPosition = -state.firstOverlayPosition / 4),
        150,
      );
      leaveTimeout2 = setTimeout(
        () => (state.firstOverlayPosition = 0),
        300,
      );
      leaveTimeout3 = setTimeout(() => {
        state.disableOverlayAnimation = false;
        state.disableInOutOverlayAnimation = true;
      }, 500);
    });
  });
}

watch(
  () => state.currentMatrix,
  (val) => {
    if (state.isTimeoutFinished) {
      state.matrix = val;
    }
  },
);

const overlayColors = [
  "hsl(358, 100%, 62%)",
  "hsl(30, 100%, 50%)",
  "hsl(60, 100%, 50%)",
  "hsl(96, 100%, 50%)",
  "hsl(233, 85%, 47%)",
  "hsl(271, 85%, 47%)",
  "hsl(300, 20%, 35%)",
  "transparent",
  "transparent",
  "white",
];

const overlayAnimationsCSS = computed(() =>
  [...Array(10).keys()]
    .map(
      (i) => `
      @keyframes oa-${uid}-${i + 1} {
        0%   { transform: rotate(${i * 10}deg); }
        50%  { transform: rotate(${(i + 1) * 10}deg); }
        100% { transform: rotate(${i * 10}deg); }
      }`,
    )
    .join(" "),
);

function overlayStyle(index: number) {
  const deg = state.firstOverlayPosition + index * 10;
  return {
    transform: `rotate(${deg}deg)`,
    transformOrigin: "center center",
    transition: !state.disableInOutOverlayAnimation
      ? "transform 200ms ease-out"
      : "none",
    animation: state.disableOverlayAnimation
      ? "none"
      : `oa-${uid}-${index + 1} 5s infinite`,
    willChange: "transform" as const,
  };
}

const Tag = computed(() => (props.link ? "a" : "div"));
</script>

<template>
  <component
    :is="Tag"
    ref="badgeRef"
    :href="link || undefined"
    :target="link ? '_blank' : undefined"
    :rel="link ? 'noopener noreferrer' : undefined"
    class="award-badge"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <component :is="'style'">{{ overlayAnimationsCSS }}</component>

    <div
      class="award-badge__card"
      :style="{
        transform: `perspective(700px) matrix3d(${state.matrix})`,
        transformOrigin: 'center center',
        transition: 'transform 200ms ease-out',
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 260 54"
        class="award-badge__svg"
      >
        <defs>
          <filter :id="blurId">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <mask :id="maskId">
            <rect width="260" height="54" fill="white" rx="10" />
          </mask>
        </defs>

        <rect width="260" height="54" rx="10" :fill="bgColor" />
        <rect
          x="4"
          y="4"
          width="252"
          height="46"
          rx="8"
          fill="transparent"
          stroke="#bbb"
          stroke-width="1"
        />

        <g v-if="iconPath" transform="translate(8, 9)">
          <path :d="iconPath" fill="#666" />
        </g>

        <text
          v-if="subtitle"
          font-family="Helvetica-Bold, Helvetica, 'Noto Sans JP', sans-serif"
          font-size="9"
          font-weight="bold"
          fill="#666"
          :x="iconPath ? 53 : 14"
          y="20"
        >
          {{ subtitle }}
        </text>
        <text
          font-family="Helvetica-Bold, Helvetica, 'Noto Sans JP', sans-serif"
          font-size="16"
          font-weight="bold"
          fill="#666"
          :x="iconPath ? 52 : 14"
          y="40"
        >
          {{ title }}
        </text>

        <g style="mix-blend-mode: overlay" :mask="`url(#${maskId})`">
          <g
            v-for="(color, idx) in overlayColors"
            :key="idx"
            :style="overlayStyle(idx)"
          >
            <polygon
              points="0,0 260,54 260,0 0,54"
              :fill="color"
              :filter="`url(#${blurId})`"
              opacity="0.5"
            />
          </g>
        </g>
      </svg>
    </div>
  </component>
</template>

<style scoped>
.award-badge {
  display: block;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.award-badge__card {
  will-change: transform;
}

.award-badge__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
