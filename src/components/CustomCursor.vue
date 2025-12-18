<template>
  <div class="custom-cursor" :style="cursorStyle" :class="{
    'hover-effect': isHovering,
    'image-active': uiStore.cursorOverrideUrl,
    'is-hidden': !isMounted
  }">
    <img v-if="uiStore.cursorOverrideUrl" :src="uiStore.cursorOverrideUrl" class="custom-cursor__image" alt="Cursor" />
    <div v-else class="custom-cursor__dot"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useUiStore } from '@/store/uiStore';

const uiStore = useUiStore();


const mouseX = ref(0);
const mouseY = ref(0);

const followerX = ref(0);
const followerY = ref(0);
let prevFollowerX = 0;
let prevFollowerY = 0;


const isHovering = ref(false);
const isMounted = ref(false);
const speed = ref(0);
const angle = ref(0);
const easingFactor = 0.45;


let animationFrameId: number;

const animate = () => {

  followerX.value += (mouseX.value - followerX.value) * easingFactor;
  followerY.value += (mouseY.value - followerY.value) * easingFactor;


  const deltaX = followerX.value - prevFollowerX;
  const deltaY = followerY.value - prevFollowerY;
  speed.value = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  angle.value = Math.atan2(deltaY, deltaX);


  prevFollowerX = followerX.value;
  prevFollowerY = followerY.value;

  animationFrameId = requestAnimationFrame(animate);
};


const updateMousePosition = (event: MouseEvent) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
};

const handleMouseOver = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.closest('a, button, [role="button"]')) {
    isHovering.value = true;
  }
};

const handleMouseOut = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.closest('a, button, [role="button"]')) {
    isHovering.value = false;
  }
};


onMounted(() => {
  const initialSetup = (e: MouseEvent) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
    followerX.value = e.clientX;
    followerY.value = e.clientY;
    prevFollowerX = e.clientX;
    prevFollowerY = e.clientY;
    isMounted.value = true;
  };
  window.addEventListener('mousemove', initialSetup, { once: true });


  window.addEventListener('mousemove', updateMousePosition);
  document.body.addEventListener('mouseover', handleMouseOver);
  document.body.addEventListener('mouseout', handleMouseOut);
  animate();
});

onUnmounted(() => {

  window.removeEventListener('mousemove', updateMousePosition);
  document.body.removeEventListener('mouseover', handleMouseOver);
  document.body.removeEventListener('mouseout', handleMouseOut);
  cancelAnimationFrame(animationFrameId);
});


const cursorStyle = computed(() => {

  let transform = `translate3d(${followerX.value}px, ${followerY.value}px, 0)`;

  if (!uiStore.cursorOverrideUrl) {
    if (isHovering.value) {
      transform += ' scale(1.5)';
    } else {
      const scaleX = 1 + Math.min(speed.value * 0.1, 1);
      const scaleY = 1 - Math.min(speed.value * 0.05, 0.4);
      transform += ` rotate(${angle.value}rad) scaleX(${scaleX}) scaleY(${scaleY})`;
    }
  }

  return { transform };
});
</script>

<style scoped>
.custom-cursor.image-active {
  width: 32px;
  height: 32px;
  top: -16px;
  left: -16px;
}

.custom-cursor {
  position: fixed;
  top: -12px;
  left: -12px;
  width: 24px;
  height: 24px;
  z-index: 9999;
  pointer-events: none;

  /* REMOVEMOS a transição do transform. A animação agora é 100% JS. */
  transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
}

/* Esconde o cursor antes do primeiro movimento do mouse */
.custom-cursor.is-hidden {
  opacity: 0;
}

/* Estilo para a imagem do cursor */
.custom-cursor__image {
  width: 100%;
  height: 100%;
}

.custom-cursor__dot {
  width: 100%;
  height: 100%;
  background-color: #fbbd24;
  border-radius: 50%;

  /* A transição agora serve para suavizar a mudança de cor e forma no hover */
  transition: all 0.2s ease-in-out;
}

/* Efeito de hover só se aplica se NÃO tiver uma imagem ativa */
.custom-cursor.hover-effect:not(.image-active) .custom-cursor__dot {
  background-color: #3b82f6;
  /* Vira azul */
  border-radius: 4px;
  /* Vira quadrado */

  /* REMOVEMOS o transform: scale(1.5) daqui, pois o JS agora o controla. */
}
</style>