<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="hidden fixed z-50 top-0 left-0 w-full h-full bg-black/50 sm:flex transition-opacity duration-[0.3s] ease-linear select-none"
      @click="handleMaskClick"
    >
      <div
        class="modal-container w-[700px] m-auto px-12 py-7 transition-all duration-[0.3s] ease-linear"
        @click.stop
      >
        <div class="my-5">
          <div class="relative flex justify-center">
            <img
              :src="images[currentImage]"
              alt="Imagem"
              class="rounded-xl"
            >
            <div
              class="absolute -top-14 right-0 cursor-pointer fill-white transition-colors hover:fill-orange-500"
              @click="close"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 12 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z"
                  fill-rule="evenodd"
                />
              </svg>
            </div>

            <div
              class="absolute -left-8 bottom-[40%] lg:bottom-[50%] right-0 flex h-6 w-1 cursor-pointer items-center justify-center rounded-full bg-white stroke-zinc-800 p-9 transition-colors hover:stroke-orange-500"
              @click="prevImage"
            >
              <div class="flex items-center justify-center">
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 12 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 1 3 9l8 8"
                    stroke-width="3"
                    fill="none"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div
              class="absolute -right-8 bottom-[40%] lg:bottom-[50%] flex h-6 w-1 cursor-pointer items-center justify-center rounded-full bg-white stroke-zinc-800 p-9 transition-colors hover:stroke-orange-500"
              @click="nextImage"
            >
              <div class="flex items-center justify-center">
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 12 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m2 1 8 8-8 8"
                    stroke-width="3"
                    fill="none"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex w-full justify-center items-center gap-4">
          <div
            v-if="!loading"
            class="w-[500px] flex place-content-center gap-6"
            :class="{ 'place-content-between': props.images.length > 3 }"
          >
            <div
              v-for="(image, index) in props.images"
              :key="index"
              class="overflow-hidden rounded-2xl"
              :class="{ 'ring ring-orange-500': currentImage === index }"
              @click="currentImage = index"
            >
              <div class="rounded-xl bg-white">
                <img
                  :src="compressedImages[index]"
                  alt="Imagem"
                  class="w-[120px] cursor-pointer rounded-xl transition-opacity hover:opacity-30"
                  :class="{ 'opacity-30': currentImage === index }"
                  @click="currentImage = image"
                >
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
  if (props.show) {
    document.addEventListener('keydown', closeOnEscape);
  }
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

<style lang="css" scoped>
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
