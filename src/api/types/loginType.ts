export type LoginDataType = {
  username: string
  password: string
}
// 返回的用户信息数据的类型
export interface ResponseUserInfoType {
  age: number
  createdAt: string
  deviceid: string
  gender: number
  grade: string
  id: number
  num: number
  phone: string
  province: string
  role: Role
  school: string
  status: number
  type: number
  updatedAt: string
  username: string
  [property: string]: any
}

export interface Role {
  createdAt: string
  id: number
  remark: string
  rolename: string
  updatedAt: string
  [property: string]: any
}
