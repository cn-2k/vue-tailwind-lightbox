<template>
  <div class="main-container">
    <div class="content-container">
      <div class="actions-buttons-container">
        <img :src="imageList[currentIndex]" alt="Imagem" class="main-image"
          @click="openLightbox(currentIndex, currentImage)" />

        <div v-if="smAndSmaller">
          <div class="action-button-prev" @click="prevImage">
            <div class="action-button-svg">
              <svg width="20" height="25" viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1 3 9l8 8" stroke-width="3" fill="none" fill-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div class="action-button-next" @click="nextImage">
            <div class="action-button-svg">
              <svg width="20" height="25" viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m2 1 8 8-8 8" stroke-width="3" fill="none" fill-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && smAndLarger" class="image-list-container"
      :class="{ 'justify-between': props.imageList.length > 3 }">
      <div v-for="(image, index) in props.imageList" :key="index" class="image-item"
        :class="{ 'active-border': currentIndex === index }">
        <img :src="compressedImages[index]" alt="image" class="thumbnail-image"
          :class="{ 'low-opacity': currentIndex === index }" @click="(currentImage = image), (currentIndex = index)" />
      </div>
    </div>
    <div v-if="loading" class="loading-container">
      <div v-for="item in 4" :key="item" class="loading-item"></div>
    </div>

    <Teleport to="body">
      <ImageLightbox v-model:show="lightboxVisible" :images="props.imageList" :initial-index="currentIndex" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCompressImage } from '../composables/useCompressImage';
import ImageLightbox from './ImageLightbox.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const { compressImage } = useCompressImage();

const props = defineProps<{
  imageList: Array<any>;
}>();

const lightboxVisible = ref<boolean>(false);
const currentIndex = ref<number>(0);
const currentImage = ref(props.imageList[0]);
const loading = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind)
const compressedImages = ref<Array<string>>([]);

const smAndSmaller = breakpoints.smallerOrEqual('sm') // sm and smaller
const smAndLarger = breakpoints.greaterOrEqual('sm') // lg and larger

const updateCurrentImage = (delta: number) => {
  currentIndex.value = (currentIndex.value + delta + props.imageList.length) % props.imageList.length;
};

const nextImage = () => updateCurrentImage(1);
const prevImage = () => updateCurrentImage(-1);

const openLightbox = (index: number, image?: any) => {
  if (smAndLarger.value) {
    currentIndex.value = index;
    lightboxVisible.value = true;
    currentImage.value = image;
  }

  return;
};

const compressImages = async () => {
  loading.value = true;
  compressedImages.value = await Promise.all(props.imageList.map(compressImage));
  loading.value = false;
};

onMounted(() => {
  compressImages();
});
</script>

<style lang="postcss" scoped>
.main-container {
  @apply select-none max-w-[500px] lg:p-4;
}

.content-container {
  @apply flex flex-col justify-center;
}

.main-image {
  @apply cursor-pointer sm:rounded-xl;
}

.image-list-container {
  @apply mt-6 flex items-center gap-4;
}

.image-item {
  @apply overflow-hidden rounded-2xl;
}

.thumbnail-image {
  @apply cursor-pointer rounded-xl transition-opacity hover:opacity-30;
}

.opacity-30 {
  opacity: 0.3;
}

.thumb-img-style {
  @apply w-[120px] cursor-pointer rounded-xl transition-opacity hover:opacity-30;
}

.thumb-img {
  @apply rounded-xl bg-white;
}

.border-active {
  @apply border-[3px] border-orange-500;
}

.thumb-img-container {
  @apply overflow-hidden rounded-2xl;
}

.place-content-between {
  place-content: space-between;
}

.thumb-container {
  @apply flex w-full justify-center items-center gap-4;
}

.thumb-subcontainer {
  @apply w-[500px] flex place-content-center gap-6;
}

.action-button-prev {
  @apply absolute left-4 lg:-left-8 bottom-[40%] lg:bottom-[50%] right-0 flex h-6 w-1 cursor-pointer items-center justify-center rounded-full bg-white stroke-zinc-800 p-6 lg:p-9 transition-colors hover:stroke-orange-500;
}

.action-button-next {
  @apply absolute right-4 lg:-right-8 bottom-[40%] lg:bottom-[50%] flex h-6 w-1 cursor-pointer items-center justify-center rounded-full bg-white stroke-zinc-800 p-6 lg:p-9 transition-colors hover:stroke-orange-500;
}

.actions-buttons-container {
  @apply relative flex justify-center;
}

.action-button-svg {
  @apply flex items-center justify-center;
}

.justify-between {
  justify-content: space-between;
}

.active-border {
  @apply border-[3px] border-orange-500;
}

.low-opacity {
  opacity: 0.3;
}

.loading-container {
  @apply mt-4 flex w-full justify-center gap-4;
}

.loading-item {
  @apply h-[130px] w-[130px] animate-pulse rounded-lg bg-gray-300;
}
</style>
