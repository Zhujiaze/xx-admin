<script lang="ts" setup>
import {  test_err } from '@/api/test'
import { useAuthStore } from '@/stores/auth'
const store = useAuthStore()
// let flag = ref(false)
// false 发送请求 true 不发送请求
const handleClick = async () => {
  const res = await store.userInfo()
  console.log(res)
}

const handleRequest = async () => {
  try {
    const res = await test_err()
    console.log('Res==>', res)
  } catch (error) {
    console.log(error)
  }
}

const str = ref('<p>hello</p> alert(123)')
</script>
<template>
  <div>
    <el-button @click="handleClick">click</el-button>

    <el-button @click="handleRequest">request</el-button>

    <div v-html="str"></div>
  </div>
</template>

<style scoped lang="scss"></style>
