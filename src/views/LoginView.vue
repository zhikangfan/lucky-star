<template>
  <div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="account"
          name="account"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { login } from '@/api/user.js'
import { showDialog } from 'vant';
import { useRouter } from 'vue-router'
const account = ref('');
const password = ref('');
const router = useRouter()
const onSubmit = async (values) => {
  const res = await login({
    account: account.value,
    password: password.value,
  })
  if (res.status !== 200) {
    showDialog({
      title: '温馨提示',
      message: res.msg,
    })
  } else {
    await router.replace('/')
  }
};
</script>
