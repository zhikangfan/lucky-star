<template>
  <van-popup v-bind="$attrs" @open="onOpen" round>
    <div class="helpContainer">
      <div class="title">
        扫描或分享二维码
      </div>
      <div class="qrCodeBox">
        <img :src="qrCodeSrc" alt="">
      </div>
      <button class="shareBtn">分享给他</button>
    </div>
  </van-popup>
</template>
<script setup>
import QRCode from 'qrcode'
import { ref } from 'vue'
import { check, getQRCode } from '@/api/invite.js'
const qrCodeSrc = ref('')
  const onOpen = async () => {
  let res = await getQRCode()
    console.log(res)
    if (res.code === 200) {
      qrCodeSrc.value = await QRCode.toDataURL(res.data.src)
      let start = true
      while (start) {
        console.log('start')
        await new Promise(resolve => setTimeout(resolve, 1000))
        let r = await check(res.data.pid)
        // console.log(r)
        // if (r.data.status) {
        //   start = false
        // } else {
        //   start = true
        // }

      }
    }

  }
</script>
<style lang="less" scoped>
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
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
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
