<script setup lang="ts">
import Measuring from "@/components/Recording/Measuring.vue";
import { provideDrawStore } from "@/provides/draw.ts";

const init = () => {
  provideDrawStore();
}

init();
</script>

<template>
  <div class="max-h-screen max-w-screen">
    <Measuring/>
  </div>
</template>