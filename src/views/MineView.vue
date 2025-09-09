<template>
  <BaseLayout>
    <div style="padding: 25px;">
      <van-space direction="vertical" fill>
        <van-button
          round
          block
          type="primary"
          plain
          @click="handleInvite"
          v-if="!userInfo?.companion"
          >邀请同伴</van-button
        >
        <div v-else>
          <van-space direction="vertical" fill>
            <div style="margin-bottom: 25px;">
              <div>
                绑定对象：{{ userInfo?.companion_user?.nickname }}
              </div>
              <div style="margin-top: 8px;">
                ID：{{ userInfo?.companion_user?.id }}
              </div>
            </div>
            <van-button round block type="danger" plain @click="handleUnbind">解除绑定</van-button>
          </van-space>
        </div>
        <van-button round block type="danger" @click="handleLogout">退出登录</van-button>
      </van-space>
    </div>
    <BindPopup v-model:show="showQRCode" />
    <div v-show="bindLottieShow"  class="bindSuccessBox" style="position: fixed; top: 0; left: 0; z-index: 9; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.35)">
      <div>
        <DotLottieVue ref="bindLottieRef"
                      :autoplay="false"
                      :loop="false"  src="https://lottie.host/0642ae99-2444-4a7a-8f3b-0f03062b2404/lP2S3vW0Cy.lottie" />
      </div>
    </div>
  </BaseLayout>
</template>
<script setup>
import BaseLayout from '@/layout/BaseLayout.vue'
import { useUserStore } from '@/stores/user.js'
import { unbind } from '@/api/user.js'
import { showConfirmDialog, showToast } from 'vant'
import { computed, ref, useTemplateRef } from 'vue'
import BindPopup from '@/components/BindPopup.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const bindLottieRef = useTemplateRef('bindLottieRef')
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const showQRCode = ref(false)
const handleInvite = () => {
  showQRCode.value = true
}
const bindLottieShow = ref(false)
const showLottieAnimation = () => {
  // 播放动画
  const dotLottie = bindLottieRef.value.getDotLottieInstance()
  bindLottieShow.value = true
  dotLottie.play()
  dotLottie.addEventListener('complete', async () => {
    bindLottieShow.value = false

    showToast('解除成功')
  })
}
const handleUnbind = async () => {
  showConfirmDialog({
    title: '温馨提示',
    message: `你确定要与${userInfo.value.companion_user?.nickname}解除绑定吗？`,
  }).then(async () => {
    let res = await unbind()

    if (res.code === 200) {
      showLottieAnimation();
      await userStore.updateUserInfo()
    } else {
      showToast(res.msg)
    }
  })
}
const handleLogout = async () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '确定要退出登录吗？',
  }).then(async () => {
    await userStore.handleLogout()


  })
}
</script>
