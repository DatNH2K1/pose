<script setup lang="ts">
import Camera from "@/components/Organisms/Camera/Camera.vue";
import Config from "@/plugins/config.ts";
import {ref} from "vue";
import Gallery from "@/components/Atoms/Gallery/Gallery.vue";
import {Pose} from "@/definitions/enums.ts";
import {ImageData, PoseData} from "@/definitions/types.ts";

const config = Config.getConfiguration()

const isShowGallery = ref(false);
const currentPose = ref(config.poses[0].type);
const images = ref<Record<string, PoseData>>({});

const nextStep = () => {
  const completePoses = Object.keys(images.value) as Pose[];
  const poses = (config.poses.map(item => item.type).filter(item => !completePoses.includes(item))) as Pose[];

  if (poses.length) {
    currentPose.value = poses[0] as Pose
  }
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
      @showPoses="() => {isShowGallery = true}"
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
</template>
