<template>
  <main>
    <h1 class="title">幸运大抽奖</h1>
    <van-space>
      <van-button type="primary" @click="() => changePopup(true)">我的奖品</van-button>
    </van-space>
    <div>剩余抽奖次数：{{count}}</div>
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
    <div class="dotLottieBox" v-show="isShow">
      <DotLottieVue
        ref="myLottie"
        :autoplay="false"
        :loop="false"
        src="https://lottie.host/226192a5-83eb-4451-95fe-61594d3c1de7/7EDME6UxvT.lottie"
      />
    </div>
    <van-popup v-model:show="showPopup" position="bottom" round
               style="height: 90%; padding-top: 4px;">
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
import { getProfile } from '@/api/user.js'

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
      count: 0,
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
  },
  methods: {
    // 点击抽奖按钮会触发star回调
    startCallback() {
      // 调用抽奖组件的play方法开始游戏
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
              startAt: 1489104000,
              endAt: 1514592000,
              valueDesc: '1.5',
              unitDesc: '元',
              description: '一旦使用对方不得违抗',
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
    getProfile().then(res => {
      if (res.status === 200) {
        this.count = res.data.count
      } else {
        this.$router.replace({
          name: 'login'
        })
      }
    }).catch(() => {
      this.count = 0;
    })
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
  margin-bottom: 40px;
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
</style>
