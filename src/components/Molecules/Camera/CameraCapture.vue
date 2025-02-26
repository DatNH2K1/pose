<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";
import type { Resolution } from "@/definitions/types.ts";
import {useDrawStore} from "@/provides/draw.ts";
import {DEFAULT, useCameraCapture} from "@/logic/Camera/cameraCapture.ts";

const drawStore = useDrawStore();

/**
 * Get the Canvas for overlay
 */
const getOverlayCanvas = () => {
  return overlay.value;
}

const {
  cameraMode,
  videoOption,
  videoResolution,
  aspectRatio,
  captureSize,
  videoEnabled,
  cameraSwitching,
  isVideoEnabled,
  isCameraSwitching,
  changeVideoOverlay
} = useCameraCapture({
  getOverlayCanvas
});

const video = ref<HTMLVideoElement | null>(null)
const overlay = ref<HTMLCanvasElement | null>(null)
const container = ref<HTMLElement>();

const emits = defineEmits<{
  (e: 'camera-ready', resolution: Resolution, captureSize: Resolution): void;
  (e: 'no-camera', err: any): void;
  (e: 'camera-loading'): void;
}>();

/**
 * Initialize the camera, make it available, and start Preview.
 * @param mode
 * @param options
 */
const setupCamera = async (mode: string | null = null, options : Resolution | null = null ) => {
  stopCamera();

  const facingMode = mode || DEFAULT.facingMode
  const videoWidth = (options ? options.width : DEFAULT.width) || 800;
  const videoHeight = (options ? options.height : DEFAULT.height) || 600;

  videoOption.value = {
    facingMode: facingMode,
    width: {
      ideal: videoWidth,
      max: DEFAULT.maxVideoWidth
    },
    height: {
      ideal: videoHeight,
      max: DEFAULT.maxVideoHeight
    }
  }

  console.log('[Video Option]', videoOption.value)

  if (!video.value || !overlay.value) {
    console.error('Missing video capture element');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: videoOption.value })
    video.value.srcObject = stream
    await video.value.play()
    const stream_settings = stream.getVideoTracks()[0].getSettings()
    if (stream_settings.width && stream_settings.height) {
      videoResolution.width = stream_settings.width;
      videoResolution.height = stream_settings.height;

      aspectRatio.value = videoResolution.width / videoResolution.height;
      resizeVideo();
    }

    if (video.value.videoWidth && video.value.videoHeight) {
      captureSize.width = video.value.videoWidth;
      captureSize.height = video.value.videoHeight;

      overlay.value.width = video.value.videoWidth;
      overlay.value.height = video.value.videoHeight;
      const context = overlay.value.getContext('2d')
      if (context) {
        context.clearRect(0, 0, video.value.videoWidth, video.value.videoHeight)
      }
    }

    videoEnabled.value = true

    emits('camera-ready',
        { width: video.value.videoWidth, height: video.value.videoHeight },
        captureSize
    )
    changeVideoOverlay(true)
  } catch (err) {
    console.error('getUserMedia not working', err);
    emits('no-camera', err)
    changeVideoOverlay(false)
    throw err
  }
}

/**
 * Deactivates the camera.
 */
const stopCamera = () => {
  videoEnabled.value = false

  if (!video.value || !video.value.srcObject) return

  video.value.pause()

  // @ts-ignore
  const tracks = video.value.srcObject.getTracks() as MediaStreamTrack[]
  if (tracks) {
    tracks.forEach((track) => {
      track.stop()
    })
  }
  video.value.srcObject = null
}

/**
 * Capture the video displayed in the Video as an image and return the DataUrl.
 */
const captureImage = () => {
  if (!videoEnabled.value || !video.value) {
    throw new Error('video is disabled')
  }
  const captureCanvas = document.createElement('canvas')
  const context = captureCanvas.getContext('2d')

  captureCanvas.width = video.value.videoWidth
  captureCanvas.height = video.value.videoHeight
  if (context) {
    context.drawImage(
        video.value,
        0,
        0,
        video.value.videoWidth,
        video.value.videoHeight
    )
  }

  return {
    imageUrl: captureCanvas.toDataURL('image/jpeg', DEFAULT.jpegQuality),
    width: captureCanvas.width,
    height: captureCanvas.height
  }
}

/**
 * Loads camera recording
 */
const loadRecording = async () => {
  emits('camera-loading');
  await setupCamera(cameraMode.value, drawStore.state.videoResolution)
}

const stopRecording = () => {
  changeVideoOverlay(false)
  stopCamera()
}

const changeCamera = () => {
  changeVideoOverlay(false)
  cameraSwitching.value = true
  cameraMode.value = cameraMode.value === 'environment' ? 'user' : 'environment';
  loadRecording().finally(() => {
    cameraSwitching.value = false
  })
}

const resizeVideo = () => {
  if (!container.value || !videoOption.value) return;

  let width = (videoOption.value.width as { ideal: number })?.ideal ?? window.innerWidth;
  let height = (videoOption.value.height as { ideal: number })?.ideal ?? window.innerHeight;

  if (width / height > aspectRatio.value) {
    width = height * aspectRatio.value;
  } else {
    height = width / aspectRatio.value;
  }

  container.value.style.width = `${width}px`;
  container.value.style.height = `${height}px`;
};

const orientationChange = () => {
  loadRecording().finally(() => {
    resizeVideo()
  })
}

defineExpose({
  loadRecording,
  stopRecording,
  changeCamera,
  captureImage,
  isVideoEnabled,
  isCameraSwitching,
  getOverlayCanvas,
  changeVideoOverlay,
})

onMounted(() => {
  window.addEventListener("resize", resizeVideo);
  window.addEventListener("orientationchange", orientationChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeVideo);
  window.removeEventListener("orientationchange", orientationChange)
});
</script>

<template>
  <div class="flex justify-center items-center w-screen h-screen bg-black">
    <div ref="container" class="relative max-w-full max-h-screen">
      <video ref="video" class="w-full h-full object-contain" playsinline autoplay muted>
        Camera is not available
      </video>
      <canvas ref="overlay" class="absolute w-full h-full left-0 top-0 pointer-events-none max-h-screen"/>
    </div>
  </div>
</template>
