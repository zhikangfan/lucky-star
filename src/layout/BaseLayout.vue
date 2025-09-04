<template>
  <div class="app">
    <div class="appBox">
      <slot></slot>
    </div>
    <van-tabbar v-model="active" :route="true">
      <van-tabbar-item to="/" replace icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const active = ref('home');
</script>
<style scoped lang="less">
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .appBox {
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>
