<template>
  <RouterView />
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;" v-show="hidden">
    <DotLottieVue
      :autoplay="true"
      :loop="true"
      :renderConfig="{
        autoResize: true,
        devicePixelRatio: 2,
        freezeOnOffscreen: true
      }"
      src="https://lottie.host/7c837466-be68-494b-8bd8-f8b8d5d62da6/jdngSIPRC8.lottie"
    />
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
import VConsole from 'vconsole'
import PubSub from 'pubsub-js'
import { onMounted, ref } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
if (import.meta.env.NODE_ENV === 'development') {
  new VConsole()
}
const hidden = ref(false)
onMounted(() => {
  PubSub.subscribe('networkError', () => {
    // showNotify({ type: 'danger', message: '发生了一些错误，即将恢复！', duration: 0 })
    hidden.value = true;
  })
})
</script>

<style scoped></style>
