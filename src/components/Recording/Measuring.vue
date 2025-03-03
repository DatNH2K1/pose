<script setup lang="ts">
import Camera from "@/components/Organisms/Camera/Camera.vue";
import Config from "@/plugins/config.ts";
import Modal from "@/components/Atoms/Modal/Modal.vue";
import {ModalPosition} from "modable";
import {ref} from "vue";

const config = Config.getConfiguration()

const isShowModes = ref(false);

console.log('[Config]', config);
</script>

<template>
  <Camera
    @showModes="() => {isShowModes = true}"
  />
  <Modal
      :visible="isShowModes"
      :position="ModalPosition.CENTER"
      :transaction="'bounce'"
      @clicked-outside="() => {isShowModes = false}"
  >
    <div>

    </div>
  </Modal>
</template>
