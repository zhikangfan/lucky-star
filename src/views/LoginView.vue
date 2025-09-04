<template>
  <div>
    <van-form @submit="onSubmit" v-if="viewType === 'login'">
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
      <div style="margin: 16px">
        <van-space direction="vertical" fill>
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
          <van-button round block plain type="primary" @click="viewType = 'register'"
            >注册</van-button
          >
        </van-space>
      </div>
    </van-form>
    <van-form @submit="onRegister" v-else>
      <van-cell-group inset>
        <van-field
          v-model="nickname"
          name="nickname"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
        <van-field
          v-model="account"
          name="account"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
        <van-field
          v-model="password_confirm"
          type="password"
          name="password"
          label="确认密码"
          placeholder="请输入确认密码"
          :rules="[{ required: true, message: '请输入确认密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-space direction="vertical" fill>
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="注册中..."
          >
            注册
          </van-button>
          <van-button round block plain type="primary" @click="viewType = 'login'"
            >继续登录</van-button
          >
        </van-space>
      </div>
    </van-form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { login, register } from '@/api/user.js'
import { showDialog, showToast } from 'vant'
import { useRouter } from 'vue-router'
const account = ref('')
const password = ref('')
const password_confirm = ref('')
const nickname = ref('')
const router = useRouter()
const loading = ref(false)
const viewType = ref('login')
const onSubmit = async (values) => {
  try {
    loading.value = true
    const res = await login({
      account: account.value,
      password: password.value,
    })
    if (res.code !== 200) {
      await showDialog({
        title: '温馨提示',
        message: res.msg,
      })
    } else {
      await router.replace('/')
    }
  } finally {
    loading.value = false
  }
}
const onRegister = async (values) => {
  try {
    if (password.value !== password_confirm.value) {
      await showDialog({
        title: '温馨提示',
        message: '两次密码不一致',
      })
      return
    }
    loading.value = true
    const res = await register({
      account: account.value,
      password: password.value,
      nickname: nickname.value,
    })
    if (res.code !== 200) {
      await showDialog({
        title: '温馨提示',
        message: res.msg || '注册失败！',
      })
    } else {
      showToast('注册成功，请登录！')
      account.value = ''
      password.value = ''
      password_confirm.value = ''
      nickname.value = ''
    }
  } finally {
    loading.value = false
  }
}
</script>
