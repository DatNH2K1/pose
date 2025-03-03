<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import CameraCapture from "@/components/Molecules/Camera/CameraCapture.vue";
import CameraActions from "@/components/Molecules/Camera/CameraActions.vue";
import {Mode, Side} from "@/definitions/enums.ts";
import {ImageData} from "@/definitions/types.ts";
import CameraPreview from "@/components/Atoms/Camera/CameraPreview.vue";
import Modal from "@/components/Atoms/Modal/Modal.vue";
import {ModalPosition} from "modable"
import {CameraProps} from "@/definitions/props.ts";

const props = withDefaults(defineProps<CameraProps>(), {
  mode: undefined,
  imageData: undefined,
  autoStopCamera: false,
});

const cameraLoading = ref(false);
const cameraError = ref(false);
const capture = ref<InstanceType<typeof CameraCapture> | null>(null);
const localImageData = ref<ImageData | undefined>(props.imageData);

const emits = defineEmits<{
  (e: 'camera-capture', mode: Mode, imageData: ImageData): void,
  (e: 'remove-picture', mode: Mode): void,
  (e: 'show-info'): void,
  (e: 'show-modes'): void,
}>()

onMounted(() => {
  if (capture.value) {
    capture.value.loadRecording()
  }
})

const buttonSide = window.innerWidth > window.innerHeight ? Side.RIGHT : Side.BOTTOM;

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
    localImageData.value = capture.value.captureImage()
    if (props.mode) {
      emits('camera-capture', props.mode, localImageData.value)
    }

    if (props.autoStopCamera) {
      capture.value.stopRecording();
    }
  }
}

const onRemovePicture = () => {
  if (capture.value) {
    if (props.mode) {
      emits('remove-picture', props.mode)
    }

    localImageData.value = undefined

    if (props.autoStopCamera) {
      capture.value.loadRecording();
    }
  }
}

watch(() => props.imageData, () => {
  localImageData.value = props.imageData
})
</script>

<template>
  <div class="relative">
    <CameraCapture
        ref="capture"
        v-show="localImageData === undefined"
        @camera-ready="onCameraReady"
        @no-camera="onCameraError"
        @camera-loading="() => { cameraLoading = true }"
    />
    <CameraPreview
        v-show="localImageData !== undefined"
        :src="localImageData?.imageUrl"
        :alt="'Picture'"
    />
    <CameraActions
        class="absolute w-full h-full left-0 top-0"
        :side="buttonSide"
        :has-picture="localImageData !== undefined"
        :camera-error="cameraError"
        @camera-change="onCameraChange"
        @camera-capture="onCameraCapture"
        @remove-picture="onRemovePicture"
        @show-info="() => {emits('show-info')}"
        @show-modes="() => {emits('show-modes')}"
    />
    <Modal
        :visible="cameraLoading"
        :position="ModalPosition.CENTER"
    >
      <div class="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full"></div>
    </Modal>
  </div>
</template>
