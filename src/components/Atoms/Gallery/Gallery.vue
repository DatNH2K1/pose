<script setup lang="ts">
import {ModalPosition} from "modable";
import Modal from "@/components/Atoms/Modal/Modal.vue";
import {GalleryProps} from "@/definitions/props.ts";
import {ref, computed, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import {Pose} from "@/definitions/enums.ts";

const props = defineProps<GalleryProps>();

const emits = defineEmits<{
  (e: 'clicked-outside'): void;
  (e: 'load-data', pose: Pose): void;
}>();

const {width, height} = useWindowSize();
const isHorizontal = computed(() => width.value > height.value);

const currentPose = ref(props.pose);
const currentSetting = computed(() => {
  return props.poses.find(item => item.type === currentPose.value)
})
const currentData = computed(() => {
  return props.imageData[currentPose.value]
})

const poseCompleted = computed(() => {
  return Object.keys(props.imageData)
})

watch([
  () => props.pose
], () => {
  currentPose.value = props.pose
})

const selectPose = (pose: Pose) => {
  currentPose.value = pose
}

const loadPoseData = () => {
  emits('load-data', currentSetting.value.type)
}
</script>

<template>
  <Modal
      :visible="props.isVisible"
      :position="ModalPosition.CENTER"
      :transaction="'bounce'"
      @clicked-outside="() => {emits('clicked-outside')}"
  >
    <div class="gallery">
      <h3 class="text-center mb-2 text-3xl select-none">{{ $t('label.gallery') }}</h3>
      <div
          class="gallery__content"
          :class="isHorizontal ? 'flex-row' : 'flex-col'"
      >
        <div
            class="gallery__item gallery__item--detail"
            :class="isHorizontal ? '' : 'w-full'"
            @click="loadPoseData"
        >
          {{ $t(currentSetting?.label) }}
          <img
              v-if="currentData"
              alt="Pose Data"
              :src="currentData?.imageData?.imageUrl"
          />
        </div>
        <div
            class="gallery__list scrollbar-none"
            :class="isHorizontal ? 'flex-col w-2/3' : 'flex flex-wrap flex-row'"
        >
          <template
              v-for="pose in props.poses"
          >
            <div
                class="gallery__item gallery__item--label"
                :class="[
                    poseCompleted.includes(pose.type) ? 'text-green-500 border-green-500' : '',
                    pose.type === currentPose ? 'text-blue-500 border-blue-500' : ''
                ]"
                @click="selectPose(pose.type)"
            >
              {{ $t(pose.label) }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </Modal>
</template>