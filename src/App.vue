<template>
    <RouterView />
</template>
<script setup>
import { RouterView } from 'vue-router'
import VConsole from 'vconsole'
import PubSub from 'pubsub-js'
import { showNotify } from 'vant'
import { onMounted } from 'vue'
if (import.meta.env.NODE_ENV === 'development') {
  new VConsole()
}
onMounted(() => {
  PubSub.subscribe('networkError', () => {
    showNotify({ type: 'danger', message: '发生了一些错误，即将恢复！', duration: 0 })
  })
})
</script>

<style scoped></style>
