<template>
  <main>
    <h1 class="title">幸运大抽奖</h1>
    <div style="background: rgba(0,0,0,.5); margin: 20px 0;color: #fff;font-size: 16px;padding: 4px 20px;
    border-radius: 14px;">您还有
      <span style="color: rgba(234, 62, 68, 1); font-weight: 700;">{{ userInfo?.count || 0 }}</span>
      次抽奖机会</div>
    <LuckyWheel
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
    />

    <div style="margin: 20px 0;">
      <van-space>
        <button class="btn" type="primary" @click="() => changePopup(true)">我的奖品</button>
      </van-space>
    </div>
    <div class="dotLottieBox" v-show="isShow">
      <DotLottieVue
        ref="myLottie"
        :autoplay="false"
        :loop="false"
        src="https://lottie.host/226192a5-83eb-4451-95fe-61594d3c1de7/7EDME6UxvT.lottie"
      />
    </div>
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      round
      style="height: 90%; padding-top: 4px"
    >
      <van-coupon-list
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        :disabled-coupons="disabledCoupons"
        @change="onChange"
        @exchange="onExchange"
        :show-exchange-bar="false"
      />
    </van-popup>
  </main>
</template>
<script>
import bgPNG from '@/assets/bg.png'
import btnPNG from '@/assets/btn.png'
import { getPrizeList } from '@/api/prize.js'
import { showDialog, showNotify, showToast } from 'vant'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { addHistory, getHistoryList } from '@/api/history.js'
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { updateProfile } from '@/api/user.js'
import dayjs from 'dayjs'

export default {
  components: {
    DotLottieVue,
  },
  data() {
    return {
      dataList: [],
      blocks: [
        {
          padding: '18px',
          imgs: [
            {
              src: bgPNG,
              width: '100%',
              height: '100%',
              rotate: true,
            },
          ],
        },
      ],
      buttons: [
        {
          radius: '45%',
          imgs: [
            {
              src: btnPNG,
              width: '100%',
              top: '-130%',
            },
          ],
          fonts: [
            {
              text: '开始\n抽奖',
              top: '-18px',
              fontColor: '#fff',
              fontSize: '18px',
              lineHeight: '22px',
            },
          ],
        },
      ],
      currentPrize: null,
      isShow: false,
      showPopup: false,
      active: 0,
      coupons: [],
      disabledCoupons: [],
      chosenCoupon: -1,
    }
  },
  computed: {
    prizes() {
      return this.dataList.map((item, idx) => {
        return {
          background: idx % 2 === 0 ? '#E8589F' : '#F9F7D8',
          fonts: [
            {
              text: item.name,
              fontSize: '20px',
              fontColor: idx % 2 === 0 ? '#fff' : '#D5629D',
              top: '12px',
            },
          ],
          info: item,
        }
      })
    },
    ...mapState(useUserStore, {
      userInfo: store => {
        console.log(store)
        return store.userInfo
      }
    })
  },
  methods: {
    ...mapActions(useUserStore, ['updateUserInfo']),
    // 点击抽奖按钮会触发star回调
    async startCallback() {
      // 调用抽奖组件的play方法开始游戏
      if (this.userInfo?.count > 0) {
        try {
          const c = this.userInfo.count - 1
          await updateProfile({
            count: c
          })
          this.updateUserInfo({
            count: c
          })
          this.$refs.myLucky.play()
          // 模拟调用接口异步抽奖
          setTimeout(() => {
            let luckIndex = this.dataList.findIndex(
              (item, idx) => this.lottery(this.dataList).name === item.name,
            )
            while (luckIndex === -1 || luckIndex >= this.prizes.length) {
              luckIndex = this.lottery(this.dataList)
            }
            // 调用stop停止旋转并传递中奖索引
            this.$refs.myLucky.stop(luckIndex)
          }, 100)
        } catch (e) {
          showToast("发生了一些错误")
        }
      } else {
        await showDialog({
          message: "没有抽奖机会啦～😭"
        })
      }

    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      // 播放动画
      const dotLottie = this.$refs.myLottie.getDotLottieInstance()
      this.isShow = true
      dotLottie.play()
      dotLottie.addEventListener('complete', () => {
        this.isShow = false
        if (prize?.info.name === '空空卡') {
          showDialog({
            message: `很遗憾！未中奖！`,
            theme: 'round-button',
          })
        } else {
          showDialog({
            title: '中奖啦！🎉',
            message: `恭喜您获得了：${prize.info.name}*1`,
            theme: 'round-button',
          })
          addHistory({
            prizeId: prize.info.pid,
            name: prize.info.name
          }).then(res => {
            if (res.status !== 200) {
              showToast(res?.msg)
            }
          }).catch(() => {
            showNotify({ message: '啊哦～服务出了点问题！', type: 'danger' });
          })
        }
      })
    },
    lottery(items) {
      // 计算总权重
      const total = items.reduce((sum, item) => {
        return sum + (item.chance || 0)
      }, 0)

      // 生成随机数
      let rand = Math.random() * total

      // 按顺序减去权重，找到对应奖项
      for (let i = 0; i < items.length; i++) {
        if (rand < items[i].chance) {
          return i // 返回索引
        }
        rand -= items[i].chance
      }
      return -1 // 默认返回第一个
    },
    async getData() {
      const res = await getPrizeList()
      if (res.status === 200) {
        this.dataList = res.data
      } else {
        await showDialog({
          title: '温馨提示',
          message: res.msg,
        })
      }
      console.log(res)
    },
    async changePopup(val) {
      this.showPopup = val
      if (val) {
        let res = await getHistoryList()
        if (res.status === 200) {
          const d = res.data?.map(history => {
            return {
              id: history.hid,
              condition: '无门槛',
              reason: '',
              value: 150,
              name: history.name,
              startAt: history.createAt / 1000,
              endAt: new Date('2099-12-31 23:59:59').getTime() / 1000,
              valueDesc: '1',
              unitDesc: '次',
              description: history.prize.desc,
              info: history
            }
          })
          this.coupons = d.filter(item => !item.info.status)
          this.defaultCoupons = d.filter(item => item.info.status)
        }

        console.log(res)
      }
    },
    onChange(index){
      this.chosenCoupon = index;
    },
    onExchange(code) {
      console.log(code, '--code')
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main h1 {
  margin-top: 62px;
  //margin-bottom: 40px;
  font-weight: bolder;
}

.dotLottieBox {
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn {
  width: 250px;
  height: 41px;
  background: rgb(255, 71, 78);
  box-shadow: rgba(141, 19, 27, 0.15) 0px 3px 0px 0px;
  border-radius: 24px;
  outline: none;
  border: none;
  font-weight: 500;
  color: #fff;
}
.btn:active {
  background: rgb(194, 52, 58);
}
</style>
