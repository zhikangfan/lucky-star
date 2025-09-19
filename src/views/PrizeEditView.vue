<template>
  <div class="page">
    <van-nav-bar
      class="nav-bar"
      title="奖品设置"
      left-text="返回"
      left-arrow
      @click-left="onBack"
    />
    <div class="page-main">
      <div class="list" v-if="list.length > 0">
        <div class="card" v-for="prizeItem in list" :key="prizeItem.id">
          <van-cell-group inset>
            <van-cell
              is-link
              :title="prizeItem.name"
              value=""
              :label="prizeItem.desc"
              @click="handleEdit(prizeItem)"
            />
          </van-cell-group>
        </div>
      </div>
      <van-empty v-else image="error" description="暂无数据" />
      <div class="btn">
        <van-button  round block type="primary" @click="onClickAdd">新增奖品</van-button>
      </div>

      <div class="loadingBox" v-if="loading">
        <van-loading color="#1989fa" size="46" />
      </div>
    </div>
    <van-popup
      v-model:show="showPopup"
      round
      @close="onClose"
      :safe-area-inset-top="true"
      :close-on-click-overlay="false"
      :closeable="false"
    >
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="prizeInfo.name"
            name="name"
            label="奖品名称"
            placeholder="请输入奖品名称"
            :rules="[{ required: true, message: '请输入奖品名称' }]"
          />
          <van-field
            v-model="prizeInfo.desc"
            name="desc"
            rows="2"
            autosize
            label="奖品描述"
            type="textarea"
            maxlength="50"
            placeholder="请输入奖品描述"
            show-word-limit
            :rules="[{ required: true, message: '请输入奖品描述' }]"
          />
          <van-field name="chance" label="中奖概率">
            <template #input>
              <van-slider v-model="prizeInfo.chance" :min="1" :max="99" :step="1">
                <template #button>
                  <div class="custom-button">{{ prizeInfo.chance }}</div>
                </template>
              </van-slider>
            </template>
          </van-field>

          <van-field name="status" label="状态">
            <template #input>
              <van-switch v-model="prizeInfo.status" />
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-space direction="vertical" fill>
            <van-button round block plain type="default" @click="onCancel" :disabled="disabled"> 取消 </van-button>
            <van-button round block type="primary" native-type="submit" :disabled="disabled"> 提交 </van-button>
          </van-space>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addPrize, getAllPrizeList, updatePrize } from '@/api/prize.js'
import { showToast } from 'vant'

const router = useRouter()

const loading = ref(true)
const disabled = ref(false)
const showPopup = ref(false)
const currentMode = ref('add') // 当前模式 add: 新增; edit: 修改

const prizeInfo = ref({
  name: '',
  desc: '',
  chance: 1, //
  // type: 0, // 0: 时间; 1: 次数
  // expires: 0, // 奖品过期时间，0时为永久，单位：秒
  // usage_duration: 0, // 生效时常，当type为时间类型时使用，单位：秒
  // usage_count: 0, // 使用次数，当type为次数类型时使用
  status: true, // 是否发布
})

const list = ref([])

const onSubmit = async (values) => {
  try {
    let res = null;
    disabled.value = true
    if (currentMode.value === 'add') {
      res = await addPrize(values)
    } else if (currentMode.value === 'edit') {
      res = await updatePrize({
        pid: prizeInfo.value?.id,
        ...values
      })
    }

    if (res?.code === 200) {
      showToast(currentMode.value === 'add' ? '添加成功' : '更新成功')
      onCancel();
      loadData()
    } else {
      showToast(currentMode.value === 'add' ? '添加失败' : '更新失败')
    }
  } finally {
    disabled.value = false
  }

}

const onBack = () => {
  router.back()
}
const onClickAdd = () => {
  showPopup.value = true
}
const onCancel = () => {
  showPopup.value = false
}
const onClose = () => {
  prizeInfo.value = {
    name: '',
    desc: '',
    chance: 1,
    status: true, // 是否发布
  }
  currentMode.value = 'add'
}
const handleEdit = (info) => {
  showPopup.value = true
  currentMode.value = 'edit'
  prizeInfo.value = {
    ...info,
  }
}
const loadData = () => {
  loading.value = true
  getAllPrizeList().then((res) => {
    if (res.code === 200) {
      list.value = res.data
    }
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadData()
})
</script>
<style scoped lang="less">
.page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .nav-bar {
    flex-shrink: 0;
  }
  .page-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    .list {
      flex: 1;
      background: #f5f5f5;

      .card {
        margin: 10px 0;
      }
    }
    .btn {
      flex-shrink: 0;
      margin-top: 20px;
      padding: 0 12px;
    }
  }

  .custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: #1989fa;
    border-radius: 100px;
  }

  .loadingBox {
    position: fixed;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-top: 50%;
    background: rgba(0,0,0,0.5);
  }
}
</style>
