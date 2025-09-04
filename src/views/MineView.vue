<template>
  <BaseLayout>
    <div>
      <van-space direction="vertical" fill>
        <van-button
          round
          block
          type="primary"
          plain
          @click="handleInvite"
          v-if="!userInfo.companion"
          >邀请同伴</van-button
        >
        <div v-else>
          <van-space direction="vertical" fil>
            <div>
              绑定对象：{{ userInfo.companion_user?.nickname }} ID:
              {{ userInfo.companion_user?.id }}
            </div>
            <van-button round block type="danger" plain @click="handleUnbind">解除绑定</van-button>
          </van-space>
        </div>
        <van-button round block type="danger">退出登录</van-button>
      </van-space>
    </div>
    <BindPopup v-model:show="showQRCode" />
  </BaseLayout>
</template>
<script setup>
import BaseLayout from '@/layout/BaseLayout.vue'
import { useUserStore } from '@/stores/user.js'
import { unbind } from '@/api/user.js'
import { showConfirmDialog, showToast } from 'vant'
import { computed, ref } from 'vue'
import BindPopup from '@/components/BindPopup.vue'
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const showQRCode = ref(false)
const handleInvite = () => {
  showQRCode.value = true
}
const handleUnbind = async () => {
  showConfirmDialog({
    title: '温馨提示',
    message: `你确定要与${userInfo.value.companion_user?.nickname}解除绑定吗？`,
  }).then(async () => {
    let res = await unbind()

    if (res.code === 200) {
      await userStore.updateUserInfo()
      showToast('解除成功')
    } else {
      showToast(res.msg)
    }
  })
}
</script>
