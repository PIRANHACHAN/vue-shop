<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse?'64px':'256px'">
      <Aside :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header>
        <div @click="handleToggleCollapse" class="toggle-btn">
          <i :class="isCollapse ?'el-icon-s-unfold':'el-icon-s-fold'"></i>
        </div>

        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="$route.path!=='/welcome'"
          >{{$router.currentRoute.meta.parentName}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.path!=='/welcome'">{{$router.currentRoute.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row class="person-center">
          <el-col>
            <img alt src="@/assets/小黄鸭.gif" />
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a href="https://github.com/PIRANHACHAN/vue-shop" target="_blank">项目地址</a>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="handleLogOut">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '@/components/Aside.vue'
export default {
  components: {
    Aside,
  },
  data() {
    return {
      isCollapse: false,
      username: '',
    }
  },
  created() {
    this.username = window.sessionStorage.getItem('username')
  },
  methods: {
    handleLogOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    handleToggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  padding-left: 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  color: #333;
  z-index: 10;
  > div {
    display: flex;
    align-items: center;
  }
}

.el-breadcrumb {
  float: left;
  line-height: 60px;
  font-size: 16px;
}

.toggle-btn {
  float: left;
  cursor: pointer;
  margin-right: 30px;
  i {
    line-height: 60px;
    font-size: 20px;
    color: #909399;
  }
}

.person-center {
  float: right;
  line-height: 60px;
  img {
    width: 50px;
    vertical-align: middle;
    margin-top: -5px;
  }
}

.el-dropdown-link {
  cursor: pointer;
}

.el-aside {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.15);
  color: #333;
  height: 100%;
  z-index: 10;
}
</style>
