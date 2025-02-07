<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";
import {ModalProps, ModalPosition} from "modable";

const props = defineProps<ModalProps>();
const emit = defineEmits(["clicked-outside"]);

const isShow = ref(props.visible);
watch(() => props.visible, (payload) => {
  isShow.value = payload;
});

const handleBackgroundClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("comModal")) {
    emit("clicked-outside");
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modalTransition">
      <div v-if="isShow"
           class="comModal"
           @click="handleBackgroundClick"
           :class="[
               props.transparent ? 'comModal--transparent' : null,
               props.position ?? ModalPosition.CENTER
           ]"
      >
        <div class="comModal__content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
