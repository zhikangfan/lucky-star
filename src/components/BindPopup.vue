<template>
  <van-popup v-bind="$attrs" @open="onOpen" round @close="onClose"  close-on-click-overlay="true">
    <div class="helpContainer">
      <div class="title">扫描或分享二维码</div>
      <div class="qrCodeBox">
        <div class="loadingBox" v-if="loading">
          <div class="loader"></div>
        </div>
        <div v-else-if="isExpired" class="refreshBox" @click="getQRCode">
          <van-icon name="replay" color="#fff" size="32px" />
          <span>二维码已失效</span>
        </div>
        <img v-if="qrCodeSrc" :src="qrCodeSrc" alt="" />
      </div>
      <button class="shareBtn" @click="handleShare">复制分享链接</button>
    </div>
  </van-popup>
</template>
<script setup>
import QRCode from 'qrcode'
import { ref } from 'vue'
import { getBindQRCode,bindCheck } from '@/api/user.js'
import { useUserStore } from '@/stores/user.js'
import { copyText } from 'vue3-clipboard'
import { showToast } from 'vant'
const userStore = useUserStore()
const qrCodeSrc = ref('')
const shareLink = ref('')
const flag = ref(true)
const loading = ref(true)
const isExpired = ref(false)
// 定义 emit 用于触发关闭事件
const emit = defineEmits(['update:show'])
const getQRCode = async () => {
  loading.value = true
  isExpired.value = false
  try {
    let res = await getBindQRCode()
    loading.value = false
    if (res.code === 200) {
      qrCodeSrc.value = await QRCode.toDataURL(res.data.src)
      shareLink.value = res.data.src;
      flag.value = true
      while (flag.value) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        let r = await bindCheck(res.data.qid)
        if (!r || r.code !== 200) {
          flag.value = false
          isExpired.value = true
          // TODO: 二维码已使用或已过期
          break
        } else if (r.data.status === true) {
          flag.value = false
          emit('update:show', false)
          await userStore.updateUserInfo()
          break
        }
      }
    }
  } catch (e) {
    console.error(e)
    loading.value = false
  }
}
const onOpen = async () => {
  await getQRCode()
}
const onClose = async () => {
  flag.value = false
  emit('update:show', false)
}
const handleShare = () => {
  if (!shareLink.value) {
    return
  }
  copyText(shareLink.value, undefined, (error) => {
    if (error) {
      showToast('复制失败！☹️')
    } else {
      showToast('复制成功！🎉')
    }
  })
}
</script>
<style lang="less" scoped>
@keyframes l20-1 {
  0% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
  }
  12.5% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
  }
  62.5% {
    clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%);
  }
}
@keyframes l20-2 {
  0% {
    transform: scaleY(1) rotate(0deg);
  }
  49.99% {
    transform: scaleY(1) rotate(135deg);
  }
  50% {
    transform: scaleY(-1) rotate(0deg);
  }
  100% {
    transform: scaleY(-1) rotate(-135deg);
  }
}
.helpContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 280px;
  border-radius: 14px;
  background: url('@/assets/helpPopup/bg.svg') no-repeat center/cover;

  .title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: bolder;
  }
  .qrCodeBox {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;

    img {
      width: 100%;
      height: 100%;
    }

    .loadingBox {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);

      .loader {
        width: 40px;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 4px solid #fff;
        animation:
          l20-1 0.8s infinite linear alternate,
          l20-2 1.6s infinite linear;
      }
    }
    .refreshBox {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 14px;
      span {
        margin-top: 8px;
      }
    }
  }

  .shareBtn {
    width: 185px;
    height: 41px;
    background: rgb(255, 71, 78);
    box-shadow: rgba(141, 19, 27, 0.15) 0px 3px 0px 0px;
    border-radius: 24px;
    outline: none;
    border: none;
    font-weight: 500;
    color: #fff;
    font-size: 16px;
    :active {
      background: rgb(194, 52, 58);
    }
  }
}
</style>
