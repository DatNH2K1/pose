<script setup lang="ts">
import {CameraActionsProps} from "@/definitions/props.ts";
import {ButtonStyle, ComButton} from "modable";
import {onClickOutside} from "@vueuse/core";
import {Side} from "@/definitions/enums.ts";
import {computed, ref} from "vue";
import {useDrawStore} from "@/provides/draw.ts";
import {getFlexDirectionActionClass, getFlexDirectionButtonGroupClass} from "@/utils/style.ts";
import {useCameraActions} from "@/logic/Camera/cameraActions.ts";
import {isMobileOrTablet} from "@/utils/device.ts";

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

const {
  openModal,
  menuSelected,
  prepareCapture,
  onTriggerModal,
  clickMenuItem,
  clickOutSideMenu
} = useCameraActions();

const menuButtonRef = ref(null);

const cameraChange = () => {
  emits('camera-change');
}

const cameraCapture = async () => {
  await prepareCapture();
  emits('camera-capture');
}

const removePicture = () => {
  emits('remove-picture');
}

const mainButtons = computed(() => {
  return [
    {
      click: onTriggerModal,
      icon: 'fas fa-bars',
      hide: false,
    },
    {
      click: cameraCapture,
      icon: 'fas fa-camera',
      hide: props.hasPicture,
      disabled: props.cameraError || openModal.value || drawStore.state.displayTimer
    },
    {
      click: removePicture,
      icon: 'fas fa-times',
      hide: !props.hasPicture,
      disabled: openModal.value
    },
    {
      click: cameraChange,
      icon: 'fa fa-sync-alt',
      hide: false,
      disabled: !isMobileOrTablet() || openModal.value
    }
  ];
});

const menuButtons = computed(() => {
  return [
    {
      click: (option: number) => {
        menuSelected.value = undefined;
        drawStore.mutations.setGridValue(option)
      },
      icon: 'fas fa-th',
      options: drawStore.state.gridValueOptions,
      active: drawStore.state.gridValue !== 0
    },
    {
      click: (option: number) => {
        menuSelected.value = undefined;
        drawStore.mutations.setTimer(option)
      },
      icon: 'fas fa-clock',
      options: drawStore.state.timerValueOptions,
      active: drawStore.state.timer !== 0
    }
  ].map((item, index) => {
    return {
      ... item,
      label: item.options.filter(item => item.selected)[0]?.label ?? 'None',
      selected: index === menuSelected.value
    }
  });
});

onClickOutside(menuButtonRef, clickOutSideMenu)
</script>

<template>
  <div
      class="cameraActions flex"
      :class="getFlexDirectionActionClass(props.side)"
  >
    <!-- Main Buttons -->
    <div
        class="flex items-center justify-center gap-2 lg:gap-4 xl:gap-8 p-3"
        :class="getFlexDirectionButtonGroupClass(props.side)"
    >
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

    <!-- Menu Buttons -->
    <div class="max-w-screen max-h-screen overflow-hidden flex justify-center items-center">
      <Transition name="bounce">
          <div
              v-if="openModal"
              ref="menuButtonRef"
              class="cameraActions__menu flex bg-gray-900 bg-opacity-75 rounded shadow py-2 px-1 xl:py-20 xl:px-14 gap-2 lg:gap-4 xl:gap-8"
              :class="getFlexDirectionButtonGroupClass(props.side)"
          >
            <template
                v-for="(button, index) in menuButtons"
            >
              <template v-if="button.selected">
                <div
                    v-for="option in button.options"
                    class="cameraActions__menu__item"
                    :class="[option.selected ? 'cameraActions__menu__item--active' : '']"
                >
                  <label
                      class="text-center font-bold"
                      @click="button.click(option.value)"
                  >
                    {{ option.label }}
                  </label>
                </div>
              </template>
              <div
                  v-else-if="menuSelected === undefined"
                  class="cameraActions__menu__item"
                  :class="[button.active ? 'cameraActions__menu__item--active' : '']"
                  @click="clickMenuItem(index)"
              >
                <i :class="button.icon"></i>
                <label class="text-center font-bold">{{ button.label }}</label>
              </div>
            </template>
          </div>
      </Transition>
    </div>
  </div>
</template>