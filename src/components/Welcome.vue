<template>
  <el-card>
    <el-alert
      :closable="false"
      :title="'欢迎进入Vue后台管理系统，当前登录：' + username"
      center
      show-icon
      type="success"
    ></el-alert>
    <el-calendar v-model="value"></el-calendar>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      username: '',
    }
  },
  created() {
    this.username = window.sessionStorage.getItem('username')
  },
}
</script>

<style lang="less" scoped></style>
