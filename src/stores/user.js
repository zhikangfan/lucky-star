import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getProfile } from '@/api/user.js'

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

  const logout = () => {
    userInfo.value = null
  }


  const updateUserInfo = async () => {
    let res = await getProfile()
    if (res.status === 200) {
      userInfo.value = {
        ...userInfo.value,
        ...res.data
      }

    }
  }

  return { userInfo, setUserInfo, updateUserInfo, logout, isLogin }
})
