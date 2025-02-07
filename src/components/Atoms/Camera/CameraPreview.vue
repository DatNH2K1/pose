<script setup lang="ts">
import {CameraPreviewProps} from "@/definitions/props.ts";
import {ref} from "vue";

//@ts-ignore
const props = withDefaults(defineProps<CameraPreviewProps>(), {
  alt: '',
  src: ''
})

const canvas = ref<HTMLCanvasElement | null>(null)
const image = ref<HTMLImageElement | null>(null)

const onImageLoad = () => {
  if (!canvas.value || !image.value) {
    console.error('Not found camera preview canvas or image')
    return;
  }

  canvas.value.width = image.value.naturalWidth
  canvas.value.height = image.value.naturalHeight

  const ctx = canvas.value.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
}

</script>

<template>
  <div class="flex justify-center items-center w-screen h-screen bg-black">
    <div class="relative w-fit">
      <img ref="image" :src="props.src" :alt="props.alt" class="max-w-full max-h-full" @load="onImageLoad">
      <canvas ref="canvas" class="absolute left-0 top-0 pointer-events-none w-full h-full"/>
    </div>
  </div>
</template>