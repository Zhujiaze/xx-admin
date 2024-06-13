import request from '@/utils/request'
import type { LoginDataType, ResponseUserInfoType } from './types/loginType'
/**
 * 登录
 */
export const login = (data: LoginDataType) => {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
/**
 * 获取用户信息接口
 * @returns
 */
export const getUserInfo = () => {
  return request<ResponseUserInfoType>({ url: '/user/info', method: 'GET' })
}
