<template>
  <div>
    <van-button @click="handleInvite" block :disabled="disabled" :loading="loading" type="success" loading-text="加载中...">点我核销</van-button>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { writeOff } from '@/api/invite.js'
  import { showToast } from 'vant'

  const route = useRoute()
  const loading = ref(false)
  const disabled = ref(false)
  const handleInvite = async () => {
    try {
      loading.value = true;
      disabled.value = true
      const {inviter, type, qid} = route.query
      let res = await writeOff({inviter, type, qid})
      if (res.code === 200) {
        showToast("核销成功")
      } else {
        showToast(res.msg)
      }
    } finally {
      loading.value = false;
      disabled.value = false
    }
  }

</script>
