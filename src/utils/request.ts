import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

import { useAuthStore } from '@/stores/auth'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

import DOMPurify from 'dompurify'
import { ElMessage } from 'element-plus'

type RequestCustomConfig = {
  isPurify: boolean
}

// 请求拦截器
// 创建一个新数组, 数组保存的是未完成请求的接口地址
// 请求成功时, 从数组里面移除已完成的请求的接口地址
// 如果这个请求没有完成, 不能在继续发送相同的请求 --->
// 如果下一次请求的接口地址在新数组里面, 说明当前的请求没有完成,这个时候, 不能再次发送请求
// 安装一个插件, &lt;script&gt;</script>
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = useAuthStore()
    if (store.token) {
      config.headers.Authorization = `Bearer ${store.token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 判断响应数据是否成功
    if (response.data.code === 200) {
      return response.data
    }
  },
  async (error: AxiosError<ResponseDataType>) => {
    // 错误提示
    const store = useAuthStore()
    let message = ''

    //判断请求是否完成的状态码从而返回错误信息
    switch (error.response?.status) {
      case 401:
        message = '登录过期，请重新登录'
        // TODO : 清除token,以及用户信息
        await store.resetUser()
        // 跳转到登录页面
        window.location.reload()
        break
      case 403:
        message = '没有权限'
        // 跳转到登录页面
        break
      case 404:
        message = '请求地址不存在'
        // 跳转到404页面
        break
      case 500:
        message = (error.response.data && error.response.data.msg) || '网络错误'
        break
      case 400:
        message = (error.response.data && error.response.data.msg) || '参数错误'
    }
    //弹出错误提示
    ElMessage({
      message,
      type: 'error',
      duration: 1000
    })

    return Promise.reject(error)
  }
)

type ResponseDataType<T = any> = {
  code: number
  msg: string
  data: T
}
// 防止未完成的请求进行重复请求 true ,
const historyRequest: string[] = []

// 完整请求的方法
const request = <T = any>(options: AxiosRequestConfig, customConfig?: RequestCustomConfig) => {
  // 防止重复的请求
  const url = options && options.url
  if (historyRequest.includes(url!)) {
    return Promise.reject(new Error('重复请求'))
  }
  url && historyRequest.push(url!)
  // 防止xss攻击, 静态脏数据
  if (customConfig?.isPurify) {
    if (options.method?.toLocaleUpperCase() === 'POST' && options.data) {
      const dataStr = JSON.stringify(options.data)
      options.data = JSON.parse(DOMPurify.sanitize(dataStr))
    }
    if (options.method?.toLocaleUpperCase() === 'GET' && options.params) {
      for (const key in options.params) {
        options.params[key] = DOMPurify.sanitize(options.params[key])
        console.log('options.params', options.params)
      }
    }
  }
  //返回请求
  return service
    .request<T, ResponseDataType<T>>({
      ...options,
      [options.method === 'GET' ? 'params' : 'data']: options.data
    })
    .finally(() => {
      const url = options && options.url
      const idx = historyRequest.indexOf(url!)
      historyRequest.splice(idx, 1)
    })
}

// 导出axios实例对象
export default request
