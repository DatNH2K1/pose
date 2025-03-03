<script setup lang="ts">
import Camera from "@/components/Organisms/Camera/Camera.vue";
import Config from "@/plugins/config.ts";
import {computed, ref} from "vue";
import Gallery from "@/components/Atoms/Gallery/Gallery.vue";
import {Pose} from "@/definitions/enums.ts";
import {ImageData, PoseData} from "@/definitions/types.ts";
import {ModalPosition} from "modable";
import Modal from "@/components/Atoms/Modal/Modal.vue";

const config = Config.getConfiguration()

const isShowGallery = ref(false);
const isShowInfo = ref(false);
const currentPose = ref(config.poses[0].type);
const images = ref<Record<string, PoseData>>({});

const currentSetting = computed(() => {
  return config.poses.find(item => item.type === currentPose.value);
})

const nextStep = () => {
  const completePoses = Object.keys(images.value) as Pose[];
  const poses = (config.poses.map(item => item.type).filter(item => !completePoses.includes(item))) as Pose[];

  if (poses.length) {
    currentPose.value = poses[0] as Pose
  }

  isShowInfo.value = true
  setTimeout(() => {
    isShowInfo.value = false
  }, 1000);
}

const onCapture = (pose: Pose, imageData: ImageData) => {
  images.value[pose] = {
    pose,
    imageData
  };

  nextStep()
};

const onRemovePicture = (pose: Pose) => {
  delete images.value[pose];
}

const onLoadData = (pose: Pose) => {
  currentPose.value = pose
  isShowGallery.value = false
}
</script>

<template>
  <Camera
      :pose="currentPose"
      :image-data="images[currentPose] ? images[currentPose].imageData : undefined"
      @show-poses="() => {isShowGallery = true}"
      @show-info="() => {isShowInfo = true}"
      @camera-capture="onCapture"
      @remove-picture="onRemovePicture"
  />
  <Gallery
      :pose="currentPose"
      :isVisible="isShowGallery"
      :poses="config.poses"
      :image-data="images"
      @clicked-outside="() => {isShowGallery = false}"
      @load-data="onLoadData"
  />
  <Modal
      :visible="isShowInfo"
      :position="ModalPosition.CENTER"
      :transaction="'bounce'"
      @clicked-outside="() => {isShowInfo = false}"
  >
    <div class="p-5 rounded bg-white min-w-60 max-w-screen-sm">
      <h4 class="text-center font-bold">{{ $t(currentSetting?.label) }}</h4>
      <div class="text-center w-full">{{ $t(currentSetting?.description) }}</div>
    </div>
  </Modal>
</template>
