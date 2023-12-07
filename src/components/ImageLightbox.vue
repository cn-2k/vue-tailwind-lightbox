<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click="handleMaskClick">
      <div class="modal-container" @click.stop>
        <div class="modal-body">
          <div class="actions-buttons-container">
            <img :src="images[currentImage]" alt="Imagem" class="rounded-xl" />
            <div
              class="close-button"
              @click="close"
            >
              <svg width="35" height="35" viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z"
                  fill-rule="evenodd"
                />
              </svg>
            </div>

            <div
              class="action-button-prev"
              @click="prevImage"
            >
              <div class="action-button-svg">
                <svg width="20" height="25" viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 1 3 9l8 8" stroke-width="3" fill="none" fill-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div
              class="action-button-next"
              @click="nextImage"
            >
              <div class="action-button-svg">
                <svg width="20" height="25" viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="m2 1 8 8-8 8" stroke-width="3" fill="none" fill-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="thumb-container">
          <div
            v-if="!loading"
            class="thumb-subcontainer"
            :class="{ 'place-content-between': props.images.length > 3 }"
          >
            <div
              v-for="(image, index) in props.images"
              :key="index"
              class="thumb-img-container"
              :class="{ 'border-active': currentImage === index }"
              @click="currentImage = index"
            >
              <div class="thumb-img">
                <img
                  :src="compressedImages[index]"
                  alt="Imagem"
                  class="thumb-img-style"
                  :class="{ 'opacity-30': currentImage === index }"
                  @click="currentImage = image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect, onUnmounted } from 'vue'
import { useCompressImage } from '../composables/useCompressImage';

const { compressImage } = useCompressImage();

const props = defineProps<{
  initialIndex?: number;
  images: Array<any>;
  show: boolean;
}>();

const compressedImages = ref<Array<string>>([]);
const loading = ref(false);

const compressImages = async () => {
  loading.value = true;
  compressedImages.value = await Promise.all(props.images.map(compressImage));
  loading.value = false;
};

onMounted(() => {
  compressImages();
});

const currentImage = ref<any>(props.initialIndex);

const updateCurrentImage = (delta: number) => {
  currentImage.value = (currentImage.value + delta + props.images.length) % props.images.length;
};

const nextImage = () => updateCurrentImage(1);
const prevImage = () => updateCurrentImage(-1);

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();

const close = () => {
  emit('update:show', false);
};

watch(
  () => props.initialIndex,
  () => {
    currentImage.value = props.initialIndex;
  }
);

const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    close();
  }
};

watchEffect(() => {
  document.addEventListener('keydown', closeOnEscape);
});

const handleMaskClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    close();
  }
};

onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
});
</script>

<style lang="postcss" scoped>
.opacity-30 {
  opacity: 0.3;
}

.thumb-img-style{
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
.thumb-subcontainer {
  @apply mt-4 flex place-content-center gap-6;
}
.thumb-container {
  @apply flex w-[650px] justify-center gap-4;
}
.close-button {
 @apply absolute -top-14 right-0 cursor-pointer fill-zinc-800 transition-colors hover:fill-orange-500;
}

.action-button-prev {
  @apply absolute -left-8 bottom-1/2 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white stroke-zinc-800 p-9 transition-colors hover:stroke-orange-500;
}

.action-button-next {
  @apply absolute -right-8 bottom-1/2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white stroke-zinc-800 p-9 transition-colors hover:stroke-orange-500;
}
.actions-buttons-container {
 @apply relative flex justify-center;
}

.action-button-svg {
  @apply flex items-center justify-center;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  user-select: none;
}

.modal-container {
  width: 700px;
  margin: auto;
  padding: 50px 30px;
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
