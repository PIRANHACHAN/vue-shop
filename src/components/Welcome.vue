<template>
  <el-card>
    <el-alert :title="'登录成功，欢迎你，' + userInfo" close-text="知道了" effect="dark" type="success"></el-alert>
    <el-calendar v-model="value"></el-calendar>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      userInfo: '',
    }
  },
  mounted() {
    this.getPageInfo(event)
  },
  methods: {
    // 切换页面后返回首页报错，用户名不再显示，暂时没想到其它方案
    getPageInfo(event) {
      let strJson = event.target.response
      let obj = JSON.parse(strJson)
      this.userInfo = obj.data.username
    },
  },
}
</script>

<style lang="less" scoped></style>
