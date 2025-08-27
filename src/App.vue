<script setup>
import { RouterView } from 'vue-router'
import VConsole from 'vconsole';
if (import.meta.env.NODE_ENV === 'development') {
  new VConsole();
}
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
