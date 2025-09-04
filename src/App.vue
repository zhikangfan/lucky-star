<script setup>
import { RouterView } from 'vue-router'
import VConsole from 'vconsole';
import BaseLayout from '@/layout/BaseLayout.vue'
if (import.meta.env.NODE_ENV === 'development') {
  new VConsole();
}
</script>

<template>
  <BaseLayout>
    <RouterView />
  </BaseLayout>
  <RouterView name="login"/>
</template>

<style scoped>

</style>
