<script setup lang="ts">
import {CameraActionsProps} from "@/definitions/props.ts";
import {ButtonStyle, ComButton, ModalPosition} from "modable";
import {Side} from "@/definitions/enums.ts";
import {isMobileOrTablet} from "@/utils/device.ts";
import Modal from "@/components/Atoms/Modal/Modal.vue";
import {computed, ref} from "vue";
import {useDrawStore} from "@/provides/draw.ts";

const drawStore = useDrawStore();

const props = withDefaults(defineProps<CameraActionsProps>(), {
  side: Side.RIGHT,
  hasPicture: false,
  cameraError: false
});

const emits = defineEmits<{
  (e: 'camera-change'): void;
  (e: 'camera-capture'): void;
  (e: 'remove-picture'): void;
}>();

const openModal = ref(false);

const getFlexDirectionClass = (side: string) => {
  switch (side) {
    case Side.LEFT:
      return 'flex-row';
    case Side.RIGHT:
      return 'flex-row-reverse';
    case Side.TOP:
      return 'flex-col';
    case Side.BOTTOM:
      return 'flex-col-reverse';
    default:
      return '';
  }
};

const cameraChange = () => {
  emits('camera-change');
}

const cameraCapture = () => {
  emits('camera-capture');
}

const removePicture = () => {
  emits('remove-picture');
}

const mainButtons = computed(() => {
  return [
    {
      click: () => openModal.value = !openModal.value,
      icon: 'fas fa-bars',
      hide: false,
    },
    {
      click: cameraCapture,
      icon: 'fas fa-camera',
      hide: props.hasPicture,
      disabled: props.cameraError
    },
    {
      click: removePicture,
      icon: 'fas fa-times',
      hide: !props.hasPicture
    },
    {
      click: cameraChange,
      icon: 'fa fa-sync-alt',
      hide: false,
      disabled: !isMobileOrTablet()
    }
  ];
});

const menuButtons = computed(() => {
  return [
    {
      click: () => {
        drawStore.mutations.nextGridValue()
      },
      icon: 'fas fa-th',
      label: drawStore.state.gridValue === 0 ? 'OFF' : (drawStore.state.gridValue + 'x' + drawStore.state.gridValue)
    }
  ];
}) ;
</script>

<template>
  <div :class="[
      'flex',
      getFlexDirectionClass(props.side)
  ]">
    <div :class="[
        'flex items-center justify-center gap-2 lg:gap-4 xl:gap-8 p-3',
        ['left', 'right'].includes(props.side) ? 'flex-col' : 'flex-rol'
    ]">
      <template
          v-for="button in mainButtons"
      >
        <ComButton
            v-if="!button.hide"
            class="comButton--camera"
            :type="ButtonStyle.CUSTOM"
            @click="button.click"
            :disabled="button.disabled"
        >
          <i :class="button.icon"></i>
        </ComButton>
      </template>
    </div>
    <Modal
        :visible="openModal"
        :position="ModalPosition.CENTER"
        @clicked-outside="() => openModal = false"
    >
      <div class="flex flex-wrap bg-gray-900 bg-opacity-75 rounded shadow p-12 xl:p-20 gap-2 lg:gap-4 xl:gap-8">
        <div
            v-for="button in menuButtons"
            class="flex flex-col"
        >
          <ComButton
              class="comButton--camera"
              :type="ButtonStyle.CUSTOM"
              @click="button.click"
          >
            <i :class="button.icon"></i>
          </ComButton>
          <label class="text-center text-white font-bold mt-3">{{ button.label }}</label>
        </div>
      </div>
    </Modal>
  </div>
</template>