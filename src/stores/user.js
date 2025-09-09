import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getProfile, logout } from '@/api/user.js'
import router from '@/router/index.js'
import { showToast } from 'vant'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({})
  const isLogin = computed(() => {
    return !!userInfo.value?.uid
  })
  function setUserInfo(info) {
    userInfo.value = {
      ...userInfo.value,
      info
    }
  }

  const handleLogout = async () => {
    userInfo.value = null
    const res = await logout();
    if (res.code === 200) {
      router.replace('/login')
    } else {
      showToast(res.msg)
    }
  }


  const updateUserInfo = async () => {
    let res = await getProfile()
    if (res.code === 200) {
      userInfo.value = {
        ...userInfo.value,
        ...res.data
      }

    }
  }

  return { userInfo, setUserInfo, updateUserInfo, handleLogout, isLogin }
})
