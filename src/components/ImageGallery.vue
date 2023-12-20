<template>
  <div class="main-container">
    <div class="content-container">
      <img
        :src="currentImage"
        class="main-image"
        alt="Imagem"
        @click="openLightbox(currentIndex, currentImage)"
      />
      <div
        v-if="!loading"
        class="image-list-container"
        :class="{ 'justify-between': props.imageList.length > 3 }"
      >
        <div
          v-for="(image, index) in props.imageList"
          :key="index"
          class="image-item"
          :class="{ 'active-border': currentIndex === index }"
        >
          <img
            :src="compressedImages[index]"
            alt="image"
            class="thumbnail-image"
            :class="{ 'low-opacity': currentIndex === index }"
            @click="(currentImage = image), (currentIndex = index)"
          />
        </div>
      </div>
      <div v-if="loading" class="loading-container">
        <div v-for="item in 4" :key="item" class="loading-item"></div>
      </div>
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

const { compressImage } = useCompressImage();

const props = defineProps<{
  imageList: Array<any>;
}>();

const lightboxVisible = ref<boolean>(false);
const currentIndex = ref<number>(0);
const currentImage = ref(props.imageList[0]);
const compressedImages = ref<Array<string>>([]);
const loading = ref(false);

const openLightbox = (index: number, image?: any) => {
  currentIndex.value = index;
  lightboxVisible.value = true;
  currentImage.value = image;
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
  @apply select-none max-w-[500px] p-4;
}

.content-container {
  @apply flex flex-col justify-center;
}

.main-image {
  @apply cursor-pointer rounded-xl;
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
