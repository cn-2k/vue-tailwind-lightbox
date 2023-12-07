import '@vue/runtime-core';
import {
  VueTailwindLightbox
} from 'vue-tailwind-lightbox';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VueTailwindLightbox: typeof VueTailwindLightbox;
  }
}

export {};
