<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/masterlogo.png" alt="" />
        <span>VUE后台管理系统</span>
      </div>
      <el-button type="info" @click="handleLogOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '../components/Aside.vue'
export default {
  components: {
    Aside,
  },
  data() {
    return {}
  },
  methods: {
    handleLogOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 4px;
  align-items: center;
  font-size: 20px;
  color: #fff;
  background-color: #373d41;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 50px;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
