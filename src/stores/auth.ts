import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfo, login } from '@/api/login'
import type { LoginDataType } from '@/api/types/loginType'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string>()
    const info = ref()
    // 设置token
    const setToken = (value: string) => {
      token.value = value
    }

    // 登录
    const userLogin = async (loginForm: LoginDataType) => {
      try {
        const res = await login(loginForm)
        console.log('res=>', res)
        setToken(res.data)
        return res
      } catch (error) {
        console.error(error)
      }
    }
    //获取用户信息
    // 获取用户信息
    const userInfo = async () => {
      try {
        const res = await getUserInfo()
        console.log('Res=>', res)
        info.value = res.data
        return res
      } catch (error) {
        console.error(error)
      }
    }
    // 重置token与用户信息
    const resetUser = () => {
      token.value = ''
      info.value = null
    }

    return { token, userLogin, userInfo, info, resetUser }
  },
  {
    persist: true // 开启持久化
  }
)
