<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import CameraCapture from "@/components/Molecules/Camera/CameraCapture.vue";
import CameraActions from "@/components/Molecules/Camera/CameraActions.vue";
import {Side} from "@/definitions/enums.ts";
import {ImageData} from "@/definitions/types.ts";
import CameraPreview from "@/components/Atoms/Camera/CameraPreview.vue";
import Modal from "@/components/Atoms/Modal/Modal.vue";
import {ModalPosition} from "modable";

const defaultImageData = {
  imageUrl: '',
  width: 640,
  height: 640
};

const cameraLoading = ref(false);
const cameraError = ref(false);
const capture = ref<InstanceType<typeof CameraCapture> | null>(null);
const imageData = ref<ImageData>(defaultImageData);

const emits = defineEmits<{
  (e: 'camera-capture', imageData: ImageData): void
}>()

onMounted(() => {
  if (capture.value) {
    capture.value.loadRecording()
  }
})

const buttonSide = computed(() => {
  return window.innerWidth > window.innerHeight ? Side.RIGHT : Side.BOTTOM
})

const onCameraReady = async () => {
  cameraLoading.value = false
}

const onCameraError = async () => {
  cameraLoading.value = false
  cameraError.value = true
}

const onCameraChange = () => {
  if (capture.value) {
    capture.value.changeCamera()
  }
}

const onCameraCapture = () => {
  if (capture.value) {
    imageData.value = capture.value.captureImage()

    emits('camera-capture', imageData.value)
  }
}
</script>

<template>
  <div class="relative">
    <CameraCapture
        ref="capture"
        v-show="imageData.imageUrl === ''"
        @camera-ready="onCameraReady"
        @no-camera="onCameraError"
        @camera-loading="() => { cameraLoading = true }"
    />
    <CameraPreview
        v-show="imageData.imageUrl !== ''"
        :src="imageData.imageUrl"
        :alt="'Picture'"
    />
    <CameraActions
        class="absolute w-full h-full left-0 top-0"
        :side="buttonSide"
        :has-picture="imageData.imageUrl !== ''"
        :camera-error="cameraError"
        @camera-change="onCameraChange"
        @camera-capture="onCameraCapture"
        @remove-picture="() => {imageData = defaultImageData}"
    />
    <Modal
        :visible="cameraLoading"
        :position="ModalPosition.CENTER"
    >
      <div class="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full"></div>
    </Modal>
  </div>
</template>
